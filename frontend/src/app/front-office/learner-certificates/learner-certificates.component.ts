import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { AssessmentService } from '../../core/services/assessment.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-learner-certificates',
  templateUrl: './learner-certificates.component.html',
  styleUrls: ['./learner-certificates.component.css']
})
export class LearnerCertificatesComponent implements OnInit {
  myCertificates: any[] = [];
  loading: boolean = true;
  currentUser: any = null;
  adminSignature: string | null = null;

  constructor(
    private certificateService: CertificateService,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.getUserFromToken();
    this.loadLearnerData();
  }

  async loadLearnerData() {
    try {
      this.loading = true;
      const loggedInId = Number(this.currentUser?.id || this.currentUser?.sub);

      // 1. Load everything needed
      const [allCerts, allUsers, allAssessments]: any = await Promise.all([
        this.certificateService.getAllCertificates().toPromise(),
        this.userService.getAllUsers().toPromise(),
        this.assessmentService.getAllAssessments().toPromise()
      ]);

      // 2. Get Authority Signature (From Admin)
      const users = allUsers.content || allUsers;
      const admin = users.find((u: any) => u.role === 'ADMIN' || u.id === 1);
      this.adminSignature = admin?.signature || null;

      // 3. Filter Certificates for THIS student only
      const certList = Array.isArray(allCerts) ? allCerts : [allCerts];
      this.myCertificates = certList.filter(c => 
        Number(c.userId) === loggedInId || 
        Number(c.enrollment?.userId) === loggedInId ||
        Number(c.enrollment?.user_id) === loggedInId
      );

      // 4. Attach Grades
      this.myCertificates.forEach(cert => {
        const related = allAssessments.filter((a: any) => a.course?.id === cert.enrollment?.course?.id);
        cert.score = related.length 
          ? Math.round(related.reduce((acc: number, curr: any) => acc + (curr.totalScore || 0), 0) / related.length) 
          : 85; 
      });

      this.loading = false;
    } catch (error) {
      console.error("Error loading achievements:", error);
      this.loading = false;
    }
  }

  async downloadPDF(cert: any) {
    const doc = new jsPDF('l', 'mm', 'a4');
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Design: Borders
    doc.setDrawColor(30, 41, 59); doc.setLineWidth(5); doc.rect(5, 5, w - 10, h - 10);
    doc.setDrawColor(202, 138, 4); doc.setLineWidth(1.5); doc.rect(12, 12, w - 24, h - 24);

    // Text: Header
    doc.setTextColor(30, 41, 59); doc.setFont('times', 'bold'); doc.setFontSize(35);
    doc.text('CERTIFICATE OF ACHIEVEMENT', w / 2, 45, { align: 'center' });

    // Text: Student Name
    doc.setTextColor(180, 130, 30); doc.setFont('times', 'italic'); doc.setFontSize(45);
    const name = `${this.currentUser?.prenom || 'Learner'} ${this.currentUser?.nom || ''}`;
    doc.text(name, w / 2, 85, { align: 'center' });

    // Text: Course
    doc.setTextColor(30, 41, 59); doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
    doc.text((cert.enrollment?.course?.title || 'Professional Course').toUpperCase(), w / 2, 120, { align: 'center' });

    // Signature & QR
    if (this.adminSignature) doc.addImage(this.adminSignature, 'PNG', 40, 150, 50, 20);
    doc.line(40, 172, 90, 172); doc.setFontSize(10); doc.text('Authorized Authority', 65, 178, { align: 'center' });

    const qr = await QRCode.toDataURL(`http://localhost:4200/verify/${cert.certificateCode}`);
    doc.addImage(qr, 'PNG', w - 60, 145, 30, 30);

    doc.save(`Certificate_${cert.certificateCode}.pdf`);
  }
}