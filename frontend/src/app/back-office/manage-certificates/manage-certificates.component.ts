import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { UserService } from '../../core/services/user.service'; 
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import SignaturePad from 'signature_pad';

declare var bootstrap: any; // Important for Modal control

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
  selectedUserId: number | null = null;
  searchTerm: string = '';
  isSavingSignature: boolean = false;
  
  // Forms for Add/Update
  selectedCertificate: any = { enrollment: {} };
  newEnrollmentId: number | null = null;

  // --- NEW ADVANCED STATES ---
  selectedCertIds: Set<number> = new Set();
  sortKey: string = 'issuedAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  stats: any[] = [];

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

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.usersList = data.content || data;
      this.calculateStats(); // Update stats when users load
    });
  }

  getUserName(userId: any): string {
    const user = this.usersList.find(u => u.id === +userId);
    return user ? `${user.prenom} ${user.nom}` : 'Loading...';
  }

  loadCertificates() {
    this.certificateService.getAllCertificates().subscribe((data: any) => {
      this.certificates = Array.isArray(data) ? data : [data];
      this.calculateStats(); // Calculate stats after loading certificates
    });
  }
  
  // --- ADD FEATURE ---
  openAddModal() {
    this.newEnrollmentId = null;
    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
  }

  confirmAdd() {
    if (!this.newEnrollmentId) return;
    this.certificateService.addCertificate(this.newEnrollmentId).subscribe(() => {
      alert("Certificate Generated Successfully!");
      this.loadCertificates();
      this.closeModal('addModal');
    });
  }

  // --- UPDATE FEATURE ---
  editCertificate(cert: any) {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert));
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
  }

  saveChanges() {
    this.certificateService.updateCertificate(this.selectedCertificate.id, this.selectedCertificate).subscribe(() => {
      alert("Update Successful!");
      this.loadCertificates();
      this.closeModal('editModal');
    });
  }

  closeModal(id: string) {
    const modalElem = document.getElementById(id);
    const modalInstance = bootstrap.Modal.getInstance(modalElem);
    if (modalInstance) modalInstance.hide();
  }

  // --- SIGNATURE & DELETE LOGIC ---
  onUserSelect() {
    this.signaturePad.clear();
    const user = this.usersList.find(u => u.id === this.selectedUserId);
    if (user?.signature) this.signaturePad.fromDataURL(user.signature);
  }

  saveSignature() {
    if (!this.selectedUserId) return;
    this.userService.saveSignature(this.selectedUserId, this.signaturePad.toDataURL()).subscribe(() => {
      alert("Signature Saved!");
      this.loadUsers(); 
    });
  }

  clearSignature() { this.signaturePad.clear(); }

  onDelete(id: number) { 
    if (confirm("Are you sure you want to delete this certificate?")) {
      this.certificateService.deleteCertificate(id).subscribe(() => this.loadCertificates());
    }
  }

  async downloadPDF(cert: any) {
    const doc = new jsPDF('l', 'mm', 'a4');
    const w = doc.internal.pageSize.getWidth(); const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(44, 62, 80); doc.setLineWidth(4); doc.rect(10, 10, w - 20, h - 20);
    doc.setDrawColor(212, 175, 55); doc.setLineWidth(1); doc.rect(14, 14, w - 28, h - 28);
    doc.setTextColor(44, 62, 80); doc.setFontSize(35); doc.text('CERTIFICATE OF ACHIEVEMENT', w / 2, 45, { align: 'center' });
    const studentName = this.getUserName(cert.enrollment?.userId || cert.enrollment?.user_id);
    doc.setFont('times', 'italic'); doc.setFontSize(40); doc.setTextColor(212, 175, 55);
    doc.text(studentName, w / 2, 92, { align: 'center' });
    doc.setFont('times', 'bold'); doc.setFontSize(22); doc.setTextColor(44, 62, 80);
    doc.text(cert.enrollment?.course?.title || 'Professional Certification', w / 2, 130, { align: 'center' });
    let sig = this.signaturePad.isEmpty() ? null : this.signaturePad.toDataURL();
    if (!sig) sig = this.usersList.find(u => u.id === this.selectedUserId)?.signature;
    if (sig) doc.addImage(sig, 'PNG', 40, h - 55, 60, 25);
    doc.line(40, h - 30, 100, h - 30); doc.setFontSize(10); doc.text('Authorized Signature', 70, h - 25, { align: 'center' });
    const qr = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
    doc.addImage(qr, 'PNG', w - 50, h - 50, 30, 30);
    doc.save(`Cert_${cert.certificateCode}.pdf`);
  }

  // --- NEW ADVANCED FUNCTIONS (ADDED WITHOUT DELETING) ---

  calculateStats() {
    const now = new Date();
    const thisMonth = this.certificates.filter(c => {
      const d = new Date(c.issuedAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    this.stats = [
      { label: 'Total Certificates', value: this.certificates.length, icon: 'bi-patch-check', color: 'primary' },
      { label: 'Issued This Month', value: thisMonth.length, icon: 'bi-calendar-check', color: 'success' },
      { label: 'Signing Authorities', value: this.usersList.length, icon: 'bi-person-badge', color: 'info' }
    ];
  }

  setSort(key: string) {
    this.sortOrder = (this.sortKey === key && this.sortOrder === 'asc') ? 'desc' : 'asc';
    this.sortKey = key;
  }

  toggleSelection(id: number) {
    this.selectedCertIds.has(id) ? this.selectedCertIds.delete(id) : this.selectedCertIds.add(id);
  }

  toggleAll(event: any) {
    if (event.target.checked) {
      this.filteredCertificates.forEach(c => this.selectedCertIds.add(c.id));
    } else {
      this.selectedCertIds.clear();
    }
  }

  bulkDelete() {
    if (confirm(`Delete ${this.selectedCertIds.size} certificates?`)) {
      this.selectedCertIds.forEach(id => {
        this.certificateService.deleteCertificate(id).subscribe();
      });
      this.certificates = this.certificates.filter(c => !this.selectedCertIds.has(c.id));
      this.selectedCertIds.clear();
      this.calculateStats();
    }
  }

  exportToCSV() {
    const headers = ["Code", "Student", "Date"];
    const rows = this.filteredCertificates.map(c => [
      c.certificateCode,
      this.getUserName(c.enrollment?.userId || c.enrollment?.user_id),
      new Date(c.issuedAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "certificates_report.csv";
    link.click();
  }

  get filteredCertificates() {
    // 1. Filter
    let list = this.certificates.filter(c => 
      c.certificateCode?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getUserName(c.enrollment?.userId || c.enrollment?.user_id).toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // 2. Sort
    return list.sort((a, b) => {
      const valA = a[this.sortKey];
      const valB = b[this.sortKey];
      if (this.sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });
  }
}