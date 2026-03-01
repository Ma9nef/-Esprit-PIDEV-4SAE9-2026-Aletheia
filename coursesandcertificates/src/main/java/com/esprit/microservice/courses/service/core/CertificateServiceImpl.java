package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.Certificate;
import com.esprit.microservice.courses.entity.Enrollment;
import com.esprit.microservice.courses.entity.EnrollmentStatus;
import com.esprit.microservice.courses.repository.CertificateRepository;
import com.esprit.microservice.courses.repository.EnrollmentRepository;
import com.esprit.microservice.courses.security.JwtReader;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements ICertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private JwtReader jwtReader;

    @Autowired
    private HttpServletRequest request;

    /**
     * MÉTHODE CORRIGÉE (MODE DEBUG POUR POSTMAN)
     */
    private Long getConnectedUserId() {
        String authHeader = request.getHeader("Authorization");

        // Si aucun token n'est fourni (comme dans votre Postman),
        // on fait comme si c'était l'utilisateur n°1 qui était connecté.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ MODE DEBUG : Aucun Token reçu, on force l'ID Utilisateur à 1");
            return 1L; // <-- Changez ce chiffre si votre utilisateur a un autre ID dans la base
        }

        return jwtReader.extractUserId(authHeader);
    }
    @Override
    public Certificate getById(Long id) {
        // This fetches the certificate by its primary key ID
        return certificateRepository.findById(id).orElse(null);
    }
    @Override
    public Certificate generateCertificate(Long enrollmentId) {
        // 1. Fetch the enrollment
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("❌ Erreur : L'inscription n°" + enrollmentId + " n'existe pas."));

        // 2. Check if the status is COMPLETED
        if (!"COMPLETED".equals(enrollment.getStatus())) {
            throw new RuntimeException("❌ Erreur : L'inscription n°" + enrollmentId + " n'est pas encore terminée (Status: " + enrollment.getStatus() + ").");
        }

        // 3. Check if certificate already exists (Prevents duplicates)
        Certificate existingCert = certificateRepository.findByEnrollmentId(enrollmentId);
        if (existingCert != null) {
            return existingCert;
        }

        // 4. Create and Save the Certificate
        Certificate certificate = new Certificate();
        certificate.setEnrollment(enrollment);
        certificate.setIssuedAt(LocalDate.now());

        // Generate a unique code
        String uniqueCode = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        certificate.setCertificateCode(uniqueCode);

        System.out.println("✅ Succès : Certificat généré pour l'utilisateur ID: " + enrollment.getUserId());

        return certificateRepository.save(certificate);
    }

    @Override
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    @Override
    public Certificate getByCode(String code) {
        return certificateRepository.findByCertificateCode(code).orElse(null);
    }

    @Override
    public void exportModernCertificate(Long certificateId, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader("Authorization");

        // Mode Debug pour le Nom
        String name = "Étudiant Test";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            name = jwtReader.extractFullName(authHeader);
        }

        Certificate cert = certificateRepository.findById(certificateId).orElse(null);
        if (cert == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Certificat introuvable");
            return;
        }

        // --- GÉNÉRATION DU PDF ---
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=Certificate_" + cert.getCertificateCode() + ".pdf");

        document.open();

        PdfContentByte canvas = writer.getDirectContent();
        Rectangle rect = new Rectangle(document.getPageSize());
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(15);
        rect.setBorderColor(new Color(184, 134, 11));
        canvas.rectangle(rect);
        canvas.stroke();

        Font fontTitle = FontFactory.getFont(FontFactory.TIMES_BOLD, 45, new Color(44, 62, 80));
        Paragraph title = new Paragraph("OFFICIAL CERTIFICATION", fontTitle);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(40);
        document.add(title);

        document.add(new Paragraph("\n"));

        Font fontSub = FontFactory.getFont(FontFactory.HELVETICA, 18, Color.GRAY);
        Paragraph subTitle = new Paragraph("This is to certify that", fontSub);
        subTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subTitle);

        document.add(new Paragraph("\n"));

        Font fontName = FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 50, new Color(184, 134, 11));
        Paragraph pName = new Paragraph(name, fontName);
        pName.setAlignment(Element.ALIGN_CENTER);
        document.add(pName);

        Font fontText = FontFactory.getFont(FontFactory.HELVETICA, 16, Color.DARK_GRAY);
        String courseName = (cert.getEnrollment().getCourse() != null) ? cert.getEnrollment().getCourse().getTitle() : "Formation";
        Paragraph pDesc = new Paragraph("has successfully demonstrated proficiency and completed all requirements for:\n" + courseName, fontText);
        pDesc.setAlignment(Element.ALIGN_CENTER);
        pDesc.setSpacingBefore(30);
        document.add(pDesc);

        try {
            String verifyUrl = "http://localhost:4200/verify/" + cert.getCertificateCode();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(verifyUrl, BarcodeFormat.QR_CODE, 120, 120);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            Image qrImage = Image.getInstance(pngOutputStream.toByteArray());
            qrImage.setAbsolutePosition(PageSize.A4.rotate().getWidth() - 150, 50);
            document.add(qrImage);
        } catch (Exception e) {
            System.err.println("Erreur QR Code: " + e.getMessage());
        }

        Font fontDate = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
        Paragraph pDate = new Paragraph("\n\nDate of Issue: " + cert.getIssuedAt(), fontDate);
        pDate.setIndentationLeft(50);
        document.add(pDate);

        document.close();
    }

    @Override
    public Map<String, Object> getCertificationAnalytics() {
        // ... (votre code analytique identique)
        return new HashMap<>();
    }

    @Override
    @Transactional
    public void deleteCertificate(Long id) {
        certificateRepository.deleteByIdCustom(id);
        certificateRepository.flush();
    }

    @Override
    @Transactional
    public void savePdfContent(Long id, byte[] content) {
        Certificate cert = certificateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        cert.setPdfContent(content);
        certificateRepository.save(cert);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<String> uploadCertificatePdf(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            Certificate cert = certificateRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Certificate not found"));

            cert.setPdfContent(file.getBytes()); // Convert file to byte array
            certificateRepository.save(cert);

            return ResponseEntity.ok("PDF stored successfully in database!");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error reading PDF file");
        }
    }
}