import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../core/services/certificate.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-explore-certificates',
  templateUrl: './explore-certificates.component.html',
  styleUrls: ['./explore-certificates.component.css']
})
export class ExploreCertificatesComponent implements OnInit {
  
  aiAnalysis: any = null; 
  loading: boolean = true;
  errorMessage: string = '';
  
  // Variables pour la notification professionnelle
  showToast: boolean = false;
  selectedModule: string = '';

  constructor(
    private certificateService: CertificateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.runRealAiAnalysis();
  }

  async runRealAiAnalysis() {
    try {
      this.loading = true;
      const currentUser = this.auth.getUserFromToken();
      
      // Sécurisation de l'ID utilisateur (vérifie plusieurs sources possibles du token)
      const loggedInId = Number(currentUser?.id );

      if (!loggedInId) {
        this.loading = false;
        this.errorMessage = "Session utilisateur non identifiée.";
        return;
      }

      // 1. Récupération des certificats
      const allCerts: any = await this.certificateService.getAllCertificates().toPromise();
      const myLastCert = allCerts.find((c: any) => 
        Number(c.userId || c.enrollment?.userId || c.user_id) === loggedInId
      );

      if (myLastCert && (myLastCert.enrollment?.id || myLastCert.enrollmentId)) {
        const idToPredict = myLastCert.enrollment?.id || myLastCert.enrollmentId;
        
        // 2. Appel du modèle Random Forest Backend
        this.certificateService.getAiCareerPath(idToPredict).subscribe({
          next: (data) => {
            this.aiAnalysis = data;
            this.loading = false;
          },
          error: (err) => {
            console.error("AI Error:", err);
            this.loading = false;
            this.errorMessage = "Modèle IA indisponible. Utilisation du parcours standard.";
          }
        });
      } else {
        this.loading = false;
        this.errorMessage = "Données insuffisantes pour l'analyse prédictive.";
      }
    } catch (e) {
      this.loading = false;
      console.error("Critical error:", e);
    }
  }

  startModule(name: string) {
    // Remplacement de l'alerte par une notification Toast
    this.selectedModule = name;
    this.showToast = true;

    // Cache la notification automatiquement après 4 secondes
    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }
}