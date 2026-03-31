import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { AssessmentService } from '../../core/services/assessment.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import * as QRCode from 'qrcode';
import JSZip from 'jszip'; // Required for Batch Download

@Component({
  selector: 'app-learner-certificates',
  templateUrl: './learner-certificates.component.html',
  styleUrls: ['./learner-certificates.component.css']
})
export class LearnerCertificatesComponent implements OnInit {
  myCertificates: any[] = [];
  filteredCertificates: any[] = []; // For Advanced Search
  loading: boolean = true;
  currentUser: any = null;
  adminSignature: string | null = null;
  searchTerm: string = ''; // For Advanced Filter

  constructor(
    private certificateService: CertificateService,
    private assessmentService: AssessmentService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router
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

      // 2. Fetch Certificates
      const allCerts: any = await this.certificateService.getAllCertificates().toPromise();
      const certList = Array.isArray(allCerts) ? allCerts : [allCerts];

      // 3. Filter certificates for THIS student specifically
      this.myCertificates = certList.filter(c => {
        const certUserId = Number(c.userId || c.user_id || c.enrollment?.userId || c.enrollment?.user_id);
        return certUserId === loggedInId;
      });

      // 4. Load Authority Signature (Past logic preserved)
      try {
        const allUsers: any = await this.userService.getAllUsers().toPromise();
        const users = allUsers.content || allUsers;
        const admin = users.find((u: any) => u.role === 'ADMIN' || u.id === 1);
        this.adminSignature = admin?.signature || null;
      } catch (e) {
        console.warn("Could not load Admin Signature, PDF will use text instead.");
      }

      // 5. Load Assessments for scoring (Past logic preserved)
      try {
        const allAssessments: any = await this.assessmentService.getAllAssessments().toPromise();
        this.myCertificates.forEach(cert => {
          const related = allAssessments.filter((a: any) => 
            (a.course?.id || a.course_id) === (cert.enrollment?.course?.id || cert.enrollment?.course_id)
          );
          cert.score = related.length 
            ? Math.round(related.reduce((acc: number, curr: any) => acc + (curr.totalScore || 0), 0) / related.length) 
            : 85; 
        });
      } catch (e) {
        console.warn("Could not load assessments, using default scores.");
        this.myCertificates.forEach(c => c.score = c.score || 85);
      }

      // Initialize filter list
      this.filteredCertificates = [...this.myCertificates];
      this.loading = false;
    } catch (error) {
      console.error("Critical error loading learner achievements:", error);
      this.loading = false;
    }
  }

  // --- ADVANCED METHOD 1: Social Sharing ---
  shareToLinkedIn(cert: any) {
    const courseTitle = cert.enrollment?.course?.title || 'Certification';
    const certUrl = `${window.location.origin}/verify/${cert.certificateCode}`;
    const text = `I'm proud to share my certification in ${courseTitle} from Aletheia! 🎓`;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  // --- ADVANCED METHOD 2: Batch Processing (Download All) ---
  async downloadAllCertificates() {
    const zip = new JSZip();
    const folder = zip.folder("My_Aletheia_Certificates");
    for (const cert of this.myCertificates) {
      const blob: any = await this.certificateService.downloadCertificateFile(cert.id).toPromise();
      folder?.file(`Certificate_${cert.certificateCode}.pdf`, blob);
    }
    const content = await zip.generateAsync({ type: "blob" });
    const url = window.URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Aletheia_Portfolio_Full.zip`;
    link.click();
  }

  // --- ADVANCED METHOD 3: Smart Search & Filtering ---
  applyFilter() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCertificates = this.myCertificates.filter(cert => {
      const title = (cert.enrollment?.course?.title || '').toLowerCase();
      const code = (cert.certificateCode || '').toLowerCase();
      return title.includes(term) || code.includes(term);
    });
  }

  // --- ADVANCED METHOD 4: Skills Analytics (For potential UI charts) ---
  getCategoryStats() {
    const categories: any = {};
    this.myCertificates.forEach(c => {
      const cat = c.enrollment?.course?.category || 'General';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    return Object.entries(categories);
  }

 
 async predictNextCourse() {
  // On utilise exactement le nom du 'path' défini dans votre app-routing.module.ts
  this.router.navigate(['/Explore3dcertificates']); 
}

  // ORIGINAL DOWNLOAD PDF LOGIC (Preserved)
  async downloadPDF(cert: any) {
    const certId = cert.id;
    const fileName = `Certificate_${cert.certificateCode || certId}.pdf`;

    this.certificateService.downloadCertificateFile(certId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log(`✅ Downloaded: ${fileName}`);
      },
      error: (err) => {
        console.error("Download failed:", err);
        alert("❌ Error: Could not download the certificate.");
      }
    });
  }
}