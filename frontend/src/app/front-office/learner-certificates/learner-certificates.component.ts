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
      
      // 1. Identify current user (Checking multiple possible token keys)
      const loggedInId = Number(this.currentUser?.id || this.currentUser?.userId || this.currentUser?.sub);
      console.log("Loading certificates for student ID:", loggedInId);

      // 2. Fetch Certificates (Independent of user list)
      const allCerts: any = await this.certificateService.getAllCertificates().toPromise();
      const certList = Array.isArray(allCerts) ? allCerts : [allCerts];

      // 3. Filter certificates for THIS student specifically
      this.myCertificates = certList.filter(c => {
        const certUserId = Number(c.userId || c.user_id || c.enrollment?.userId || c.enrollment?.user_id);
        return certUserId === loggedInId;
      });

      // 4. Load Authority Signature (Wrapped in try-catch so it doesn't block the UI)
      try {
        const allUsers: any = await this.userService.getAllUsers().toPromise();
        const users = allUsers.content || allUsers;
        const admin = users.find((u: any) => u.role === 'ADMIN' || u.id === 1);
        this.adminSignature = admin?.signature || null;
      } catch (e) {
        console.warn("Could not load Admin Signature due to permissions, PDF will use text instead.");
      }

      // 5. Load Assessments for scoring (Optional)
      try {
        const allAssessments: any = await this.assessmentService.getAllAssessments().toPromise();
        this.myCertificates.forEach(cert => {
          const related = allAssessments.filter((a: any) => 
            (a.course?.id || a.course_id) === (cert.enrollment?.course?.id || cert.enrollment?.course_id)
          );
          cert.score = related.length 
            ? Math.round(related.reduce((acc: number, curr: any) => acc + (curr.totalScore || 0), 0) / related.length) 
            : 85; // Fallback score
        });
      } catch (e) {
        console.warn("Could not load assessments, using default scores.");
        this.myCertificates.forEach(c => c.score = c.score || 85);
      }

      this.loading = false;
    } catch (error) {
      console.error("Critical error loading learner achievements:", error);
      this.loading = false;
    }
  }

 async downloadPDF(cert: any) {
  const certId = cert.id; // Or however you access the ID
  const fileName = `Certificate_${cert.certificateCode || certId}.pdf`;

  this.certificateService.downloadCertificateFile(certId).subscribe({
    next: (blob: Blob) => {
      // 1. Create a temporary URL for the binary data
      const url = window.URL.createObjectURL(blob);
      
      // 2. Create a hidden link element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // 3. Trigger the download
      document.body.appendChild(link);
      link.click();
      
      // 4. Cleanup: remove the link and revoke the URL to save memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ Downloaded: ${fileName}`);
    },
    error: (err) => {
      console.error("Download failed:", err);
      alert("❌ Error: Could not download the certificate from the server.");
    }
  });
}
}