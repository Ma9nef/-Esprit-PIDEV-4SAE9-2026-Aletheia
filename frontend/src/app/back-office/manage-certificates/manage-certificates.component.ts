import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';

import { EnrollmentService } from '../../core/services/enrollment.service';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import SignaturePad from 'signature_pad';
import { UserService } from 'src/app/core/services/user.service';

declare var bootstrap: any;

@Component({
  standalone: false,
  selector: 'app-manage-certificates',
  templateUrl: './manage-certificates.component.html',
  styleUrls: ['./manage-certificates.component.css']
})
export class ManageCertificatesComponent implements OnInit, AfterViewInit {
getProbabilityColor(score: number): string {
  if (score >= 80) {
    return 'success'; // Green: High probability of passing
  } else if (score >= 50) {
    return 'warning'; // Yellow/Orange: Moderate risk
  } else {
    return 'danger';  // Red: High risk of failure
  }
}

  @ViewChild('sigCanvas') canvasContext!: ElementRef;
  signaturePad!: SignaturePad;
isSendingEmail: { [key: number]: boolean } = {};
  // Data
  certificates: any[] = [];
  usersList: any[] = [];
  enrollments: any[] = [];


selectedEnrollmentIdForPredict: number | null = null; // Changed from UserID to EnrollmentID
successResult: any = null;
isPredicting: boolean = false;

  // UI State
  selectedUserId: number | null = null; // Used for Admin Signature selection
  selectedLearnerIdForAdd: number | null = null; // Used in Add Modal to pick the student
  searchTerm: string = '';
  stats: any[] = [];

  // Form Models
  selectedCertificate: any = { enrollment: {} };
  newEnrollmentId: number | null = null;

  constructor(
    private certificateService: CertificateService,
    private userService: UserService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCertificates(); // This will trigger loadAllEnrollments internally
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasContext.nativeElement, {
      penColor: 'rgb(0, 0, 128)',
      backgroundColor: 'rgba(255, 255, 255, 0)'
    });
  }

  // --- 1. DATA LOADING ---

  loadCertificates() {
    this.certificateService.getAllCertificates().subscribe((data: any) => {
      this.certificates = Array.isArray(data) ? data : [data];
      this.calculateStats();
      // Load enrollments ONLY after certificates are ready to avoid the "already certified" error
      this.loadAllEnrollments();
    });
  }
async sendEmail(cert: any) {
  const userId = cert.enrollment?.userId || cert.enrollment?.user_id;
  const user = this.usersList.find(u => u.id === +userId);

  if (!user?.email) {
    alert("User email not found!");
    return;
  }


  this.isSendingEmail[cert.id] = true;

  // STEP 1: Generate the PDF in the browser
  const doc = await this.generateCertificateContent(cert);
  const blob = doc.output('blob');

  // STEP 2: Save it to the database first
  this.certificateService.uploadCertificatePdf(cert.id, blob).subscribe({
    next: () => {
      console.log("PDF Saved. Now sending email...");

      // STEP 3: Send the email only after the PDF is safely in the DB
      this.certificateService.sendEmail(cert.id, user.email).subscribe({
        next: () => {
          alert(`✅ Success: Certificate sent to ${user.email}`);
          this.isSendingEmail[cert.id] = false;
        },
        error: (err) => {
          console.error("Email Error:", err);
          alert("❌ Server Error: Check your IntelliJ logs for 'MailAuthenticationException'");
          this.isSendingEmail[cert.id] = false;
        }
      });
    },
    error: (err) => {
      alert("❌ Failed to save PDF to database. Email cancelled.");
      this.isSendingEmail[cert.id] = false;
    }
  });
}
  loadAllEnrollments() {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        // Create a list of IDs that already have certificates
        const certifiedIds = this.certificates.map(c => c.enrollment?.id || c.enrollmentId).filter(id => !!id);
        // Only show enrollments that are NOT in that list
        this.enrollments = data.filter(e => !certifiedIds.includes(e.id));
      },
      error: (err) => console.error("Could not load enrollments", err)
    });
  }

loadUsers() {
  this.userService.getAllUsers().subscribe({
    next: (data: any) => {
      // Handle different API structures (Paginated vs List)
      this.usersList = data.content ? data.content : (Array.isArray(data) ? data : []);

      console.log("--- DEBUG USERS ---");
      console.log("Total users received:", this.usersList.length);
      if (this.usersList.length > 0) {
        console.log("Fields in first user:", Object.keys(this.usersList[0]));
        console.log("Signature of first user:", this.usersList[0].signature ? "EXISTS" : "MISSING/NULL");
      }
    },
    error: (err) => console.error("Could not load users", err)
  });
}
  // --- 2. GETTERS & HELPERS ---

  getUserName(userId: any): string {
    if (!userId) return 'Unassigned';
    const user = this.usersList.find(u => u.id === +userId);
    return user ? `${user.prenom} ${user.nom}` : 'Unknown Student';
  }

  get learnersOnly() {
    return this.usersList.filter(u =>
      u.role === 'LEARNER' ||
      u.roles?.some((r: any) => r.name === 'LEARNER')
    );
  }

  get enrollmentsForSelectedLearner() {
    if (!this.selectedLearnerIdForAdd) return [];
    return this.enrollments.filter(e => (e.userId || e.user_id) === this.selectedLearnerIdForAdd);
  }

  get filteredCertificates() {
    return this.certificates.filter(c => {
      const name = this.getUserName(c.enrollment?.userId || c.enrollment?.user_id).toLowerCase();
      const code = (c.certificateCode || '').toLowerCase();
      const term = this.searchTerm.toLowerCase();
      return name.includes(term) || code.includes(term);
    });
  }

  calculateStats() {
    this.stats = [
      { label: 'Total Issued', value: this.certificates.length, icon: 'bi-patch-check', color: 'primary' },
      { label: 'Pending Enrollments', value: this.enrollments.length, icon: 'bi-journal-bookmark', color: 'success' },
      { label: 'Total Users', value: this.usersList.length, icon: 'bi-people', color: 'info' }
    ];
  }

  // --- 3. CRUD ACTIONS ---

  confirmAdd() {
    if (!this.newEnrollmentId) {
      alert("Please select a valid enrollment.");
      return;
    }
    this.certificateService.addCertificate(this.newEnrollmentId).subscribe({
      next: () => {
        alert("Certificate Generated successfully!");
        this.loadCertificates(); // Reloads table and refreshes dropdown list
        this.closeModal('addModal');
        this.newEnrollmentId = null;
        this.selectedLearnerIdForAdd = null;
      },
      error: (err) => alert("Error: Enrollment might already be certified on the server.")
    });
  }

  editCertificate(cert: any) {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert));
    if (!this.selectedCertificate.enrollment) this.selectedCertificate.enrollment = {};
    new bootstrap.Modal(document.getElementById('editModal')).show();
  }

  saveChanges() {
    if (!this.selectedCertificate.id) return;
    this.certificateService.updateCertificate(this.selectedCertificate.id, this.selectedCertificate).subscribe({
      next: () => {
        alert("Updated Successfully!");
        this.loadCertificates();
        this.closeModal('editModal');
      },
      error: (err) => alert("Failed to update.")
    });
  }

  onDelete(id: number) {
    if (confirm("Permanently delete this certificate?")) {
      this.certificateService.deleteCertificate(id).subscribe(() => this.loadCertificates());
    }
  }

  // --- 4. SIGNATURE & PDF ---

  onUserSelect() {
    this.signaturePad.clear();
    const user = this.usersList.find(u => u.id === this.selectedUserId);
    if (user?.signature) this.signaturePad.fromDataURL(user.signature);
  }

  saveSignature() {
    if (!this.selectedUserId) return;
    this.userService.saveSignature(this.selectedUserId, this.signaturePad.toDataURL()).subscribe(() => {
      alert("Admin Signature Stored!");
      this.loadUsers();
    });
  }

  clearSignature() { this.signaturePad.clear(); }

private async generateCertificateContent(cert: any): Promise<jsPDF> {
  const doc = new jsPDF('l', 'mm', 'a4');
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // --- 1. THEMES & COLORS ---
  const NavyBlue = [44, 62, 80];
  const Gold = [184, 134, 11];
  const LightGray = [127, 140, 141];

  // --- 2. BORDERS ---
  doc.setDrawColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.setLineWidth(5);
  doc.rect(5, 5, w - 10, h - 10);
  doc.setDrawColor(Gold[0], Gold[1], Gold[2]);
  doc.setLineWidth(1);
  doc.rect(12, 12, w - 24, h - 24);

  // --- 3. TITLES ---
  doc.setFont('times', 'bold');
  doc.setFontSize(42);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text('CERTIFICATE', w / 2, 48, { align: 'center' });

  // --- 4. RECIPIENT ---
  const learnerId = cert.enrollment?.userId || cert.enrollment?.user_id;
  const studentName = (this.getUserName(learnerId) || 'Valued Student').toUpperCase();
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(52);
  doc.setTextColor(Gold[0], Gold[1], Gold[2]);
  doc.text(studentName, w / 2, 95, { align: 'center' });

  // --- 5. COURSE ---
  const courseTitle = cert.enrollment?.course?.title || 'Professional Certification';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text(courseTitle, w / 2, 128, { align: 'center' });

  // --- 6. EMERGENCY SIGNATURE LOGIC ---
  const footerY = h - 45;
  doc.setDrawColor(LightGray[0], LightGray[1], LightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(40, footerY + 10, 100, footerY + 10);

  // LOGS FOR DEBUGGING (Open F12 to see these)
  console.log("PDF Generation Started...");
  console.log("Current Users List Length:", this.usersList.length);
  console.log("Selected Admin ID:", this.selectedUserId);

  // SEARCH LOGIC
  // 1. Try the selected ID
  let signee = this.usersList.find(u => u.id === this.selectedUserId);

  // 2. If nothing selected or user has no signature, find the first person in DB who HAS a signature
  if (!signee || !signee.signature) {
    console.log("Target user not found or has no signature. Searching for fallback...");
    signee = this.usersList.find(u => u.signature && u.signature.startsWith('data:image'));
  }

  if (signee && signee.signature) {
    console.log("✅ Signature found for user:", signee.prenom);
    try {
      // Use the signature string directly from DB
      doc.addImage(signee.signature, 'PNG', 45, footerY - 15, 50, 25);
    } catch (e) {
      console.error("❌ jsPDF failed to draw signature:", e);
    }
  } else {
    console.error("❌ CRITICAL: No signature data found in usersList at all!");
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text('DIRECTOR OF EDUCATION', 70, footerY + 16, { align: 'center' });

  // --- 7. QR CODE ---
  try {
    const qrData = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
    doc.addImage(qrData, 'PNG', w - 50, footerY - 15, 30, 30);
  } catch (e) {}

  // --- 8. FOOTER ---
  doc.setFontSize(9);
  doc.text(`Issued on: ${cert.issuedAt}`, 15, h - 15);
  doc.text(`ID: ${cert.certificateCode}`, w - 15, h - 15, { align: 'right' });

  return doc;
}
async savePDFToDatabase(cert: any) {
  // 1. Generate the PDF object
  const doc = await this.generateCertificateContent(cert);

  // 2. Convert to Blob
  const blob = doc.output('blob');

  // 3. Send to Service
  this.certificateService.uploadCertificatePdf(cert.id, blob).subscribe({
    next: () => {
      alert("✅ Success: PDF generated and saved to database!");
    },
    error: (err) => {
      console.error("Upload error:", err);
      alert("❌ Error: Could not save PDF to database.");
    }
  });
}

  async downloadPDF(cert: any) {
    const doc = await this.generateCertificateContent(cert);
    doc.save(`Certificate_${cert.certificateCode}.pdf`);
  }

  // --- 5. UTILS ---

  exportToCSV() {
    const headers = "Code,Learner,Course,Date\n";
    const content = this.filteredCertificates.map(c => {
      const name = this.getUserName(c.enrollment?.userId || c.enrollment?.user_id);
      const course = c.enrollment?.course?.title || 'N/A';
      return `${c.certificateCode},${name},${course},${c.issuedAt}`;
    }).join("\n");

    const blob = new Blob([headers + content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificates_report.csv';
    a.click();
  }

  openAddModal() {
    this.selectedLearnerIdForAdd = null;
    this.newEnrollmentId = null;
    this.loadAllEnrollments();
    new bootstrap.Modal(document.getElementById('addModal')).show();
  }

  closeModal(id: string) {
    const modalElement = document.getElementById(id);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  }
predictCertificationSuccess() {
  if (!this.selectedEnrollmentIdForPredict) return;

  this.isPredicting = true;
  this.successResult = null;

  this.certificateService.getCertificationPrediction(this.selectedEnrollmentIdForPredict)
    .subscribe({
      next: (data) => {
        // data matches your Postman response: { currentProgress, score, recommendation }
        this.successResult = data;
        this.isPredicting = false;
      },
      error: (err) => {
        console.error("AI Service Error:", err);
        alert(err.error?.error || "ML Error: Check database data.");
        this.isPredicting = false;
      }
    });
}

}
