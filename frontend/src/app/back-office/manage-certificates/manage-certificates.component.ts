import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Certificate } from '../../core/models/certificate.model';
import { CertificateService } from '../../core/services/certificate.service';
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

  certificates: Certificate[] = [];
  searchTerm: string = '';
  selectedCertificate: any = { enrollment: {} };

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  ngAfterViewInit(): void {
    // Initialisation de la zone de signature
    this.signaturePad = new SignaturePad(this.canvasContext.nativeElement, {
      penColor: 'rgb(0, 0, 128)' // Bleu marine
    });
  }

  loadCertificates(): void {
    this.certificateService.getAllCertificates().subscribe({
      next: (data: any) => {
        this.certificates = Array.isArray(data) ? data : [data];
      },
      error: (err) => console.error('Error fetching certificates:', err)
    });
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  // --- PDF LOGIC AVANCÉE ---
  async downloadModern(cert: Certificate): Promise<void> {
    const doc = new jsPDF('l', 'mm', 'a4'); // Mode Paysage
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Bordure décorative Or
    doc.setDrawColor(184, 134, 11);
    doc.setLineWidth(1.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // 2. Titre Principal
    doc.setTextColor(44, 62, 80);
    doc.setFont('times', 'bold');
    doc.setFontSize(35);
    doc.text('OFFICIAL CERTIFICATION', pageWidth / 2, 45, { align: 'center' });

    // 3. Texte d'introduction
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.text('This is to certify that', pageWidth / 2, 70, { align: 'center' });

    // 4. Nom de l'étudiant
    doc.setFont('times', 'bolditalic');
    doc.setFontSize(40);
    doc.setTextColor(184, 134, 11);
    const studentName = cert.enrollment?.user?.fullName || 'Learner';
    doc.text(studentName, pageWidth / 2, 100, { align: 'center' });

    // 5. Texte de conclusion
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(`Successfully completed the requirements for the program`, pageWidth / 2, 120, { align: 'center' });
    doc.text(`Issued on: ${new Date(cert.issuedAt!).toLocaleDateString()}`, pageWidth / 2, 130, { align: 'center' });

    // 6. INSERTION DE LA SIGNATURE (En bas à gauche)
    if (!this.signaturePad.isEmpty()) {
      const signatureImg = this.signaturePad.toDataURL(); // Récupère le dessin
      doc.addImage(signatureImg, 'PNG', 40, pageHeight - 60, 60, 30);
      
      // Ligne de signature
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(40, pageHeight - 32, 100, pageHeight - 32);
      
      doc.setFontSize(12);
      doc.text('Signature of Authority', 70, pageHeight - 25, { align: 'center' });
    }

    // 7. QR CODE (En bas à droite)
    try {
      const verifyUrl = `http://localhost:4200/verify/${cert.certificateCode}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl);
      doc.addImage(qrDataUrl, 'PNG', pageWidth - 55, pageHeight - 55, 35, 35);
      doc.setFontSize(8);
      doc.text('Scan to verify', pageWidth - 37.5, pageHeight - 15, { align: 'center' });
    } catch (err) { console.error('QR Error', err); }

    // 8. Sauvegarde
    doc.save(`Certificate_${cert.certificateCode}.pdf`);
  }

  // --- AUTRES MÉTHODES ---
  get filteredCertificates() {
    return this.certificates.filter(c => 
      c.certificateCode?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editCertificate(cert: Certificate): void {
    this.selectedCertificate = JSON.parse(JSON.stringify(cert));
    const modalElem = document.getElementById('editModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElem);
    modalInstance.show();
  }

  closeModal() {
    const modalElem = document.getElementById('editModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElem);
    if (modalInstance) modalInstance.hide();
  }

  onDelete(id: number): void {
    if (confirm("Delete this certificate?")) {
      this.certificateService.deleteCertificate(id).subscribe(() => {
        this.loadCertificates();
      });
    }
  }

openAddModal(): void {
    const enrollId = prompt("Enter Enrollment ID to generate certificate:");
    
    if (enrollId) {
      this.certificateService.addCertificate(+enrollId).subscribe({
        next: (res) => {
          // CE CODE S'EXÉCUTERA MAINTENANT !
          alert(res); // Affichera "Certificat généré avec succès ! Code : ..."
          this.loadCertificates(); 
        },
        error: (err) => {
          console.error("Erreur détaillée:", err);
          alert("Erreur : Impossible de générer le certificat.\nVérifiez que l'ID est correct et que le cours est terminé.");
        }
      });
    }
  }

  // --- UPDATE CERTIFICATE ---
  saveChanges(): void {
    // 1. On récupère la date au format correct (YYYY-MM-DD)
    const dateValue = this.selectedCertificate.issuedAt;

    // 2. On prépare l'objet exact que Spring Boot attend
    const dataToSave = {
      id: this.selectedCertificate.id,
      certificateCode: this.selectedCertificate.certificateCode,
      issuedAt: dateValue,
      enrollment: {
        id: Number(this.selectedCertificate.enrollment?.id) // S'assure que c'est bien un nombre
      }
    };

    // 3. Appel au service pour faire le PUT
    this.certificateService.updateCertificate(dataToSave.id, dataToSave as any).subscribe({
      next: () => {
        alert("Certificat mis à jour avec succès !");
        this.loadCertificates(); // Recharge le tableau
        this.closeModal();       // Ferme le popup
      },
      error: (err) => {
        console.error("Erreur lors de la mise à jour", err);
        alert("Erreur lors de la sauvegarde. Vérifiez la console.");
      }
    });
  }
}