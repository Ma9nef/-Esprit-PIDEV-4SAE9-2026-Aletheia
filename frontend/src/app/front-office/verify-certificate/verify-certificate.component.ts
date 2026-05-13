import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
import { Location } from '@angular/common'; // Import this correctly

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
    private certificateService: CertificateService,
    private location: Location // Inject correctly
  ) { }

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    
    if (code) {
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
    } else {
      this.loading = false;
      this.error = true;
    }
  }

  // Smart back button function
  goBack(): void {
    this.location.back();
  }
}