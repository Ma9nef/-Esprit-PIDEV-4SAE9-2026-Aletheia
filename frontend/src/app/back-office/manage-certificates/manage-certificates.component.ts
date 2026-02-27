import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { UserService } from '../../core/services/user.service'; 
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

  certificates: any[] = [];
  usersList: any[] = []; 
  
  // Selection & UI State
  selectedUserId: number | null = null; // Admin selected for the signature
  searchTerm: string = '';
  stats: any[] = [];

  // Form Models
  selectedCertificate: any = { enrollment: {} };
  newEnrollmentId: number | null = null;

  constructor(private certificateService: CertificateService, private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadCertificates();
  }

  ngAfterViewInit(): void {
    this.signaturePad = new SignaturePad(this.canvasContext.nativeElement, {
      penColor: 'rgb(0, 0, 128)',
      backgroundColor: 'rgba(255, 255, 255, 0)'
    });
  }

  // --- 1. DATA LOADING ---
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

  getUserName(userId: any): string {
    if (!userId) return 'Unassigned';
    const user = this.usersList.find(u => u.id === +userId);
    return user ? `${user.prenom} ${user.nom}` : 'Unknown Student';
  }

  get learnersOnly() {
    return this.usersList.filter(u => u.role === 'LEARNER' || u.roles?.some((r:any) => r.name === 'LEARNER'));
  }

  // --- 2. PDF GENERATION LOGIC ---
  private async generateCertificateContent(cert: any): Promise<jsPDF> {
    const doc = new jsPDF('l', 'mm', 'a4');
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Design: Frames
    doc.setDrawColor(44, 62, 80); doc.setLineWidth(4); doc.rect(10, 10, w - 20, h - 20);
    doc.setDrawColor(212, 175, 55); doc.setLineWidth(1); doc.rect(14, 14, w - 28, h - 28);
    
    // Header
    doc.setTextColor(44, 62, 80); doc.setFontSize(30); 
    doc.text('CERTIFICATE OF ACHIEVEMENT', w / 2, 45, { align: 'center' });

    // DYNAMIC LEARNER NAME (The Fix)
    const learnerId = cert.enrollment?.userId || cert.enrollment?.user_id;
    const learnerName = this.getUserName(learnerId); 
    doc.setFont('times', 'italic'); doc.setFontSize(45); doc.setTextColor(212, 175, 55);
    doc.text(learnerName, w / 2, 92, { align: 'center' }); 

    // Course Title
    doc.setFont('times', 'bold'); doc.setFontSize(22); doc.setTextColor(44, 62, 80);
    doc.text(cert.enrollment?.course?.title || 'Professional Certification', w / 2, 130, { align: 'center' });

    // Admin Signature (The Admin selection)
    let sig = this.signaturePad.isEmpty() ? null : this.signaturePad.toDataURL();
    if (!sig) sig = this.usersList.find(u => u.id === this.selectedUserId)?.signature;
    if (sig) doc.addImage(sig, 'PNG', 40, h - 55, 60, 25);
    doc.line(40, h - 30, 100, h - 30); doc.setFontSize(10); doc.text('Authorized Signature', 70, h - 25, { align: 'center' });

    // QR Code
    const qr = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
    doc.addImage(qr, 'PNG', w - 50, h - 50, 30, 30);

    return doc;
  }

  async savePDFToDatabase(cert: any) {
    const doc = await this.generateCertificateContent(cert);
    const pdfBlob = doc.output('blob');
    this.certificateService.uploadCertificatePdf(cert.id, pdfBlob).subscribe({
      next: () => alert("Sync Successful! Certificate PDF saved in Database."),
      error: (err) => alert("Database Sync Error: " + err.status)
    });
  }

  async downloadPDF(cert: any) {
    const doc = await this.generateCertificateContent(cert);
    doc.save(`Cert_${cert.certificateCode}.pdf`);
  }

  // --- 3. CRUD & ERROR HANDLING ---
  confirmAdd() {
    if (!this.newEnrollmentId) return;
    this.certificateService.addCertificate(this.newEnrollmentId).subscribe({
      next: () => {
        alert("Certificate Generated!");
        this.loadCertificates();
        this.closeModal('addModal');
        this.newEnrollmentId = null;
      },
      error: (err) => {
        console.error("Backend 500 Error:", err);
        alert("Server Error (500): Check if Enrollment ID exists or is already certified.");
      }
    });
  }

  // --- (Other CRUD methods like editCertificate, saveChanges, onDelete, etc.) ---
  openAddModal() { new bootstrap.Modal(document.getElementById('addModal')).show(); }
  
  editCertificate(cert: any) {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert));
    new bootstrap.Modal(document.getElementById('editModal')).show();
  }

  saveChanges() {
    this.certificateService.updateCertificate(this.selectedCertificate.id, this.selectedCertificate).subscribe(() => {
      this.loadCertificates();
      this.closeModal('editModal');
    });
  }

  onDelete(id: number) { 
    if (confirm("Permanently delete this certificate?")) {
      this.certificateService.deleteCertificate(id).subscribe(() => this.loadCertificates());
    }
  }

  closeModal(id: string) {
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById(id));
    if (modalInstance) modalInstance.hide();
  }

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

  calculateStats() {
    this.stats = [
      { label: 'Total Issued', value: this.certificates.length, icon: 'bi-patch-check', color: 'primary' },
      { label: 'Learners', value: this.learnersOnly.length, icon: 'bi-people', color: 'success' },
      { label: 'Admins', value: this.usersList.length - this.learnersOnly.length, icon: 'bi-shield-lock', color: 'info' }
    ];
  }

  get filteredCertificates() {
    return this.certificates.filter(c => 
      c.certificateCode?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getUserName(c.enrollment?.userId || c.enrollment?.user_id).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  exportToCSV() {
    const headers = "Code,Learner,Date\n";
    const content = this.filteredCertificates.map(c => `${c.certificateCode},${this.getUserName(c.enrollment?.userId)},${c.issuedAt}`).join("\n");
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(headers + content);
    link.download = 'certificates.csv';
    link.click();
  }
}