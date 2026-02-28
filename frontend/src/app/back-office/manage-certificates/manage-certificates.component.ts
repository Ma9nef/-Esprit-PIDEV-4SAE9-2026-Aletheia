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

  // Data arrays
  certificates: any[] = [];
  usersList: any[] = [];
  enrollments: any[] = [];

  // UI State
  selectedUserId: number | null = null;
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
    this.loadCertificates();
    this.loadAllEnrollments();
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasContext.nativeElement, {
      penColor: 'rgb(0, 0, 128)',
      backgroundColor: 'rgba(255, 255, 255, 0)'
    });
  }

  // --- 1. DATA LOADING ---

  loadAllEnrollments() {
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        // Filter out enrollments that already have a certificate
        const certifiedIds = this.certificates.map(c => c.enrollment?.id);
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

  loadCertificates() {
    this.certificateService.getAllCertificates().subscribe((data: any) => {
      this.certificates = Array.isArray(data) ? data : [data];
      this.calculateStats();
    });
  }

  // --- 2. HELPERS & GETTERS ---

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
      { label: 'Available Enrollments', value: this.enrollments.length, icon: 'bi-journal-bookmark', color: 'success' },
      { label: 'Total Users', value: this.usersList.length, icon: 'bi-people', color: 'info' }
    ];
  }

  // --- 3. CRUD ACTIONS ---

  confirmAdd() {
    if (!this.newEnrollmentId) return;
    this.certificateService.addCertificate(this.newEnrollmentId).subscribe({
      next: () => {
        alert("Certificate Generated successfully!");
        this.loadCertificates();
        this.loadAllEnrollments();
        this.closeModal('addModal');
        this.newEnrollmentId = null;
      },
      error: (err) => alert("Error: Enrollment might already be certified.")
    });
  }

  editCertificate(cert: any) {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert)); // Deep copy
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

    // Design
    doc.setDrawColor(44, 62, 80); doc.setLineWidth(4); doc.rect(10, 10, w - 20, h - 20);
    doc.setTextColor(44, 62, 80); doc.setFontSize(25); doc.text('CERTIFICATE OF ACHIEVEMENT', w / 2, 45, { align: 'center' });

    // Learner Name
    const learnerId = cert.enrollment?.userId || cert.enrollment?.user_id;
    doc.setFont('times', 'italic'); doc.setFontSize(40); doc.setTextColor(212, 175, 55);
    doc.text(this.getUserName(learnerId), w / 2, 90, { align: 'center' });

    // Course
    doc.setFont('times', 'bold'); doc.setFontSize(20); doc.setTextColor(44, 62, 80);
    doc.text(cert.enrollment?.course?.title || 'Professional Course', w / 2, 125, { align: 'center' });

    // Signature
    let sig = this.signaturePad.toDataURL();
    if (this.signaturePad.isEmpty()) sig = this.usersList.find(u => u.id === this.selectedUserId)?.signature;
    if (sig) doc.addImage(sig, 'PNG', 40, h - 50, 50, 20);

    // QR
    const qr = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
    doc.addImage(qr, 'PNG', w - 50, h - 50, 25, 25);

    return doc;
  }

  async savePDFToDatabase(cert: any) {
    const doc = await this.generateCertificateContent(cert);
    this.certificateService.uploadCertificatePdf(cert.id, doc.output('blob')).subscribe(() => alert("Synced to Database!"));
  }

  async downloadPDF(cert: any) {
    const doc = await this.generateCertificateContent(cert);
    doc.save(`Certificate_${cert.certificateCode}.pdf`);
  }

  // --- 5. EXPORT & MODALS ---

  exportToCSV() {
    const headers = "Code,Learner,Date\n";
    const content = this.filteredCertificates.map(c => {
      const name = this.getUserName(c.enrollment?.userId);
      return `${c.certificateCode},${name},${c.issuedAt}`;
    }).join("\n");
    
    const blob = new Blob([headers + content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificates_report.csv';
    a.click();
  }

  openAddModal() { 
    this.loadAllEnrollments();
    new bootstrap.Modal(document.getElementById('addModal')).show(); 
  }

  closeModal(id: string) {
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById(id));
    if (modalInstance) modalInstance.hide();
  }
}