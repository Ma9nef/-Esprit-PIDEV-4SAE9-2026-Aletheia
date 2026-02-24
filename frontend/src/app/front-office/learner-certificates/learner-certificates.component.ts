import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { Certificate } from '../../core/models/certificate.model';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-learner-certificates',
  templateUrl: './learner-certificates.component.html',
  styleUrls: ['./learner-certificates.component.css']
})
export class LearnerCertificatesComponent implements OnInit {
  myCertificates: Certificate[] = [];
  loading: boolean = true;

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadMyCertificates();
  }

  loadMyCertificates(): void {
    // Assuming your backend has a way to filter by logged-in user
    // If not, you can filter the getAll results by user ID locally
    this.certificateService.getAllCertificates().subscribe({
      next: (data: any) => {
        // Example: Filter for student with ID 5 (Replace with real Auth logic)
        const currentUserId = 5; 
        this.myCertificates = data.filter((c: any) => c.enrollment?.user?.id === currentUserId);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  async downloadCertificate(cert: Certificate) {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Reusing your Modern PDF Logic
    doc.setDrawColor(44, 62, 80); 
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setFont('times', 'bold');
    doc.setFontSize(40);
    doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 50, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text('This credential is proudaly presented to', pageWidth / 2, 75, { align: 'center' });

    doc.setFont('times', 'italic');
    doc.setFontSize(35);
    const name = cert.enrollment?.user?.fullName || 'Learner';
    doc.text(name, pageWidth / 2, 100, { align: 'center' });

    // Add QR Code for Verification
    const verifyUrl = `http://localhost:4200/verify/${cert.certificateCode}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl);
    doc.addImage(qrDataUrl, 'PNG', pageWidth - 50, pageHeight - 50, 35, 35);

    doc.save(`${name}_Certificate.pdf`);
  }
}