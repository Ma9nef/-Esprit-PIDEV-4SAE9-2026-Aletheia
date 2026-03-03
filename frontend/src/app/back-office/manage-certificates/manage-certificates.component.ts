import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { UserService } from '../../core/services/user.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import SignaturePad from 'signature_pad';

declare var bootstrap: any;

@Component({
  selector: 'app-manage-certificates',
  templateUrl: './manage-certificates.component.html',
  styleUrls: ['./manage-certificates.component.css']
})
export class ManageCertificatesComponent implements OnInit, AfterViewInit {
  @ViewChild('sigCanvas') canvasContext!: ElementRef;
  signaturePad!: SignaturePad;
isSendingEmail: { [key: number]: boolean } = {};
  // Data
  certificates: any[] = [];
  usersList: any[] = [];
  enrollments: any[] = [];

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
sendEmail(cert: any) {
  const userId = cert.enrollment?.userId || cert.enrollment?.user_id;
  const user = this.usersList.find(u => u.id === +userId);

  if (!user || !user.email) {
    alert("This student does not have an email address associated with their account.");
    return;
  }

  if (confirm(`Send certificate ${cert.certificateCode} to ${user.email}?`)) {
    this.isSendingEmail[cert.id] = true; // Start loading for this specific row

    this.certificateService.sendEmail(cert.id, user.email).subscribe({
      next: () => {
        alert(`✅ Success: Certificate sent to ${user.email}`);
        this.isSendingEmail[cert.id] = false;
      },
      error: (err) => {
        console.error(err);
        alert("❌ Error: Could not send email. Check backend mailer configuration.");
        this.isSendingEmail[cert.id] = false;
      }
    });
  }
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
    this.userService.getAllUsers().subscribe(data => {
      this.usersList = data.content || data;
      this.calculateStats();
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
  // Create PDF in Landscape A4
  const doc = new jsPDF('l', 'mm', 'a4');
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // --- 1. THEMES & COLORS ---
  const NavyBlue = [44, 62, 80];
  const Gold = [184, 134, 11];
  const LightGray = [127, 140, 141];

  // --- 2. PROFESSIONAL BORDERS ---
  // Thick Outer Navy Border
  doc.setDrawColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.setLineWidth(5);
  doc.rect(5, 5, w - 10, h - 10);

  // Thin Inner Gold Border
  doc.setDrawColor(Gold[0], Gold[1], Gold[2]);
  doc.setLineWidth(1);
  doc.rect(12, 12, w - 24, h - 24);

  // Decorative Corner Accents (Triangles)
  doc.setFillColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.triangle(5, 5, 30, 5, 5, 30, 'F'); // Top Left
  doc.triangle(w - 5, 5, w - 30, 5, w - 5, 30, 'F'); // Top Right
  doc.triangle(5, h - 5, 30, h - 5, 5, h - 30, 'F'); // Bottom Left
  doc.triangle(w - 5, h - 5, w - 30, h - 5, w - 5, h - 30, 'F'); // Bottom Right

  // --- 3. HEADER SECTION ---
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text('PREMIUM E-LEARNING ALETHEIA', w / 2, 25, { align: 'center' });

  doc.setFontSize(42);
  doc.text('CERTIFICATE', w / 2, 48, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('OF COMPLETION AND ACHIEVEMENT', w / 2, 58, { align: 'center', charSpace: 2 });

  // --- 4. RECIPIENT NAME SECTION ---
  doc.setFontSize(18);
  doc.setTextColor(LightGray[0], LightGray[1], LightGray[2]);
  doc.text('This is to certify that', w / 2, 75, { align: 'center' });

  const learnerId = cert.enrollment?.userId || cert.enrollment?.user_id;
  const studentName = (this.getUserName(learnerId) || 'Valued Student').toUpperCase();
  
  doc.setFont('times', 'bolditalic');
  doc.setFontSize(52);
  doc.setTextColor(Gold[0], Gold[1], Gold[2]);
  doc.text(studentName, w / 2, 95, { align: 'center' });

  // --- 5. COURSE DETAILS ---
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.setTextColor(LightGray[0], LightGray[1], LightGray[2]);
  doc.text('has successfully demonstrated proficiency in the course:', w / 2, 112, { align: 'center' });

  const courseTitle = cert.enrollment?.course?.title || 'Professional Certification Program';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text(courseTitle, w / 2, 128, { align: 'center' });

  // Optional: Add Score if available
  if (cert.score) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'italic');
    doc.text(`Final Grade: ${cert.score}%`, w / 2, 138, { align: 'center' });
  }

  // --- 6. SIGNATURE & AUTHORITY ---
  const footerY = h - 45;
  
  // Signature Line (Left)
  doc.setDrawColor(LightGray[0], LightGray[1], LightGray[2]);
  doc.setLineWidth(0.5);
  doc.line(40, footerY + 10, 100, footerY + 10);

  // Load Admin Signature
  let sig = this.usersList.find(u => u.id === this.selectedUserId)?.signature;
  if (sig) {
    try {
      doc.addImage(sig, 'PNG', 45, footerY - 15, 50, 25);
    } catch (e) {
      console.warn("Signature image error:", e);
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(NavyBlue[0], NavyBlue[1], NavyBlue[2]);
  doc.text('DIRECTOR OF EDUCATION', 70, footerY + 16, { align: 'center' });

  // --- 7. VERIFICATION (QR CODE) ---
  const qrSize = 30;
  const qrX = w - 40 - (qrSize / 2);
  const qrY = footerY - 15;

  const qrData = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
  doc.addImage(qrData, 'PNG', qrX, qrY, qrSize, qrSize);
  
  doc.setFontSize(8);
  doc.setTextColor(LightGray[0], LightGray[1], LightGray[2]);
  doc.text('SCAN TO VERIFY', qrX + (qrSize / 2), qrY + qrSize + 5, { align: 'center' });

  // --- 8. FOOTER METADATA ---
  doc.setFont('courier', 'normal');
  doc.setFontSize(9);
  const date = cert.issuedAt || new Date().toISOString().split('T')[0];
  doc.text(`Issued on: ${date}`, 15, h - 15);
  doc.text(`Certificate ID: ${cert.certificateCode}`, w - 15, h - 15, { align: 'right' });

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
}