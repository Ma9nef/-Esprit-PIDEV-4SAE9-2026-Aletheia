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
  selectedUserId: number | null = null;
  searchTerm: string = '';
  
  selectedCertificate: any = { enrollment: {} };
  newEnrollmentId: number | null = null;

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
      this.calculateStats();
    });
  }

  getUserName(userId: any): string {
    const user = this.usersList.find(u => u.id === +userId);
    return user ? `${user.prenom} ${user.nom}` : 'Unknown Student';
  }

  loadCertificates() {
    this.certificateService.getAllCertificates().subscribe((data: any) => {
      this.certificates = Array.isArray(data) ? data : [data];
      this.calculateStats();
    });
  }

  // --- ADD FEATURE ---
  openAddModal() {
    this.newEnrollmentId = null;
    const modalElem = document.getElementById('addModal');
    if (modalElem) {
      const modal = new bootstrap.Modal(modalElem);
      modal.show();
    }
  }

  confirmAdd() {
    if (!this.newEnrollmentId) return;
    this.certificateService.addCertificate(this.newEnrollmentId).subscribe(() => {
      alert("Certificate Generated!");
      this.loadCertificates();
      this.closeModal('addModal');
    });
  }

  // --- UPDATE FEATURE (FIXED ILLEGAL INVOCATION) ---
  editCertificate(cert: any) {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert));
    
    // Ensure nested objects exist for student selection
    if (!this.selectedCertificate.enrollment) {
      this.selectedCertificate.enrollment = { userId: null };
    } else {
      // Map user_id to userId if necessary for consistency
      this.selectedCertificate.enrollment.userId = cert.enrollment?.userId || cert.enrollment?.user_id;
    }

    const modalElem = document.getElementById('editModal');
    if (modalElem) {
      const modal = new bootstrap.Modal(modalElem);
      modal.show();
    } else {
      console.error("Modal element 'editModal' not found in HTML.");
    }
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

  // --- SIGNATURE LOGIC ---
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
    if (confirm("Delete this certificate?")) {
      this.certificateService.deleteCertificate(id).subscribe(() => this.loadCertificates());
    }
  }

  // --- ADVANCED FEATURES ---
  calculateStats() {
    const now = new Date();
    const thisMonth = this.certificates.filter(c => new Date(c.issuedAt).getMonth() === now.getMonth());
    this.stats = [
      { label: 'Total Certificates', value: this.certificates.length, icon: 'bi-patch-check', color: 'primary' },
      { label: 'New This Month', value: thisMonth.length, icon: 'bi-calendar-check', color: 'success' },
      { label: 'Authorities', value: this.usersList.length, icon: 'bi-person-badge', color: 'info' }
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
    if (event.target.checked) this.filteredCertificates.forEach(c => this.selectedCertIds.add(c.id));
    else this.selectedCertIds.clear();
  }

  bulkDelete() {
    if (confirm(`Delete ${this.selectedCertIds.size} certificates?`)) {
      this.selectedCertIds.forEach(id => this.certificateService.deleteCertificate(id).subscribe());
      this.certificates = this.certificates.filter(c => !this.selectedCertIds.has(c.id));
      this.selectedCertIds.clear();
      setTimeout(() => this.calculateStats(), 500);
    }
  }

  exportToCSV() {
    const headers = ["Code", "Student", "Date"];
    const rows = this.filteredCertificates.map(c => [c.certificateCode, this.getUserName(c.enrollment?.userId || c.enrollment?.user_id), c.issuedAt]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "certificates.csv";
    link.click();
  }

  async downloadPDF(cert: any) {
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.text('CERTIFICATE OF ACHIEVEMENT', 148, 45, { align: 'center' });
    doc.save(`Cert_${cert.certificateCode}.pdf`);
  }

  get filteredCertificates() {
    let list = this.certificates.filter(c => 
      c.certificateCode?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getUserName(c.enrollment?.userId || c.enrollment?.user_id).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    return list.sort((a, b) => {
      const valA = a[this.sortKey]; const valB = b[this.sortKey];
      return this.sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }
}