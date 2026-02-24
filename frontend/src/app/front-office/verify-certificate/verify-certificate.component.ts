import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
declare var bootstrap: any;
@Component({
  selector: 'app-verify-certificate',
  templateUrl: './verify-certificate.component.html',
  styleUrls: ['./verify-certificate.component.css']
})
export class VerifyCertificateComponent implements OnInit {
  certificate: any = null;
  loading = true;
  error = false;
  

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService
  ) { }

  ngOnInit(): void {
    // 1. Get the code from the URL (e.g. CERT-34565992)
    const code = this.route.snapshot.paramMap.get('code');
    
    if (code) {
      // 2. Call the service to verify with the backend
      this.certificateService.getCertificateByCode(code).subscribe({
        next: (data) => {
          this.certificate = data;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    }
  }
}