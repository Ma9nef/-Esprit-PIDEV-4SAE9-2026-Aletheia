package com.esprit.microservice.courses.service.core;


import com.esprit.microservice.courses.entity.Certificate;
import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.esprit.microservice.courses.entity.progress.EnrollmentStatus;
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
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import weka.classifiers.bayes.NaiveBayes;
import weka.classifiers.trees.RandomForest;
import weka.core.Attribute;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import java.time.LocalDate;
import java.util.*;
import java.util.List;

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
    @Autowired
    private JavaMailSender mailSender;

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
    public void sendCertificateByEmail(Long certificateId, String recipientEmail) throws MessagingException {
        Certificate cert = certificateRepository.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        if (cert.getPdfContent() == null) {
            throw new RuntimeException("No PDF content found for this certificate.");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // --- ADD THIS LINE HERE ---
        // It must match your spring.mail.username exactly!
        helper.setFrom("skanderferjani07@gmail.com");

        helper.setTo(recipientEmail);
        helper.setSubject("Your Certificate of Completion - " + cert.getCertificateCode());
        helper.setText("Congratulations! Please find your certificate attached.");

        helper.addAttachment("Certificate_" + cert.getCertificateCode() + ".pdf",
                new ByteArrayResource(cert.getPdfContent()));

        mailSender.send(message);
    }
    @Override
    public Certificate getById(Long id) {
        // This fetches the certificate by its primary key ID
        return certificateRepository.findById(id).orElse(null);
    }
    @Override
    @Transactional
    public Certificate generateCertificate(Long enrollmentId) {
        // 1. Fetch the enrollment
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("❌ Erreur : L'inscription n°" + enrollmentId + " n'existe pas."));

        // 2. Check if the status is COMPLETED - FIXED: Use enum comparison instead of string
        if (enrollment.getStatus() != EnrollmentStatus.COMPLETED) {
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

        // --- NEW: FETCH SIGNATURE FROM USER SERVICE ---
        // Since signatures are on port 8080 and this is 8081, we fetch it via RestTemplate
        String signatureBase64 = null;
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            // Adjust this URL to match your User service endpoint for getting signature
            String userSignatureUrl = "http://localhost:8080/api/users/" + cert.getEnrollment().getUserId() + "/signature";
            signatureBase64 = restTemplate.getForObject(userSignatureUrl, String.class);
        } catch (Exception e) {
            System.err.println("Could not fetch signature: " + e.getMessage());
        }

        // --- GÉNÉRATION DU PDF ---
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=Certificate_" + cert.getCertificateCode() + ".pdf");

        document.open();

        // 1. Border
        PdfContentByte canvas = writer.getDirectContent();
        Rectangle rect = new Rectangle(document.getPageSize());
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(15);
        rect.setBorderColor(new Color(184, 134, 11));
        canvas.rectangle(rect);
        canvas.stroke();

        // 2. Title
        Font fontTitle = FontFactory.getFont(FontFactory.TIMES_BOLD, 45, new Color(44, 62, 80));
        Paragraph title = new Paragraph("OFFICIAL CERTIFICATION", fontTitle);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(40);
        document.add(title);

        document.add(new Paragraph("\n"));

        // 3. Subtitle
        Font fontSub = FontFactory.getFont(FontFactory.HELVETICA, 18, Color.GRAY);
        Paragraph subTitle = new Paragraph("This is to certify that", fontSub);
        subTitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subTitle);

        document.add(new Paragraph("\n"));

        // 4. Student Name
        Font fontName = FontFactory.getFont(FontFactory.TIMES_BOLDITALIC, 50, new Color(184, 134, 11));
        Paragraph pName = new Paragraph(name, fontName);
        pName.setAlignment(Element.ALIGN_CENTER);
        document.add(pName);

        // 5. Course Info
        Font fontText = FontFactory.getFont(FontFactory.HELVETICA, 16, Color.DARK_GRAY);
        String courseName = (cert.getEnrollment().getCourse() != null) ? cert.getEnrollment().getCourse().getTitle() : "Formation";
        Paragraph pDesc = new Paragraph("has successfully demonstrated proficiency and completed all requirements for:\n" + courseName, fontText);
        pDesc.setAlignment(Element.ALIGN_CENTER);
        pDesc.setSpacingBefore(30);
        document.add(pDesc);

        // 6. QR Code (Bottom Right)
        try {
            String verifyUrl = "http://localhost:4200/verify/" + cert.getCertificateCode();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(verifyUrl, BarcodeFormat.QR_CODE, 120, 120);
            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            Image qrImage = Image.getInstance(pngOutputStream.toByteArray());
            qrImage.setAbsolutePosition(PageSize.A4.rotate().getWidth() - 150, 50);
            document.add(qrImage);
        } catch (Exception e) {}

        // 7. --- NEW: ADD SIGNATURE IMAGE ---
        if (signatureBase64 != null && !signatureBase64.isEmpty()) {
            try {
                // Clean the Base64 string if it contains the data:image prefix
                if (signatureBase64.contains(",")) {
                    signatureBase64 = signatureBase64.split(",")[1];
                }
                byte[] signatureBytes = java.util.Base64.getDecoder().decode(signatureBase64);
                Image sigImage = Image.getInstance(signatureBytes);

                // Position above the "Director" line
                sigImage.setAbsolutePosition(100, 90);
                sigImage.scaleToFit(140, 60);
                document.add(sigImage);
            } catch (Exception e) {
                System.err.println("Signature Image Error: " + e.getMessage());
            }
        }

        // 8. Footer (Date and Director line)
        Font fontFooter = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);

        // Position the Issue Date
        Paragraph pDate = new Paragraph("\n\nDate of Issue: " + cert.getIssuedAt(), fontFooter);
        pDate.setIndentationLeft(50);
        pDate.setSpacingBefore(80); // Create space for signature
        document.add(pDate);

        // Add Director line
        Paragraph pLine = new Paragraph("__________________________", fontFooter);
        pLine.setIndentationLeft(50);
        document.add(pLine);

        Paragraph pDirector = new Paragraph("DIRECTOR OF EDUCATION", fontFooter);
        pDirector.setIndentationLeft(70);
        document.add(pDirector);

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
    public Map<String, Object> predictCertificationSuccess(Long enrollmentId) throws Exception {
        // 1. Define Attributes
        Attribute progressAttr = new Attribute("progress");
        ArrayList<String> statusLabels = new ArrayList<>(Arrays.asList("OTHER", "COMPLETED"));
        Attribute targetAttr = new Attribute("target_status", statusLabels);

        ArrayList<Attribute> attributes = new ArrayList<>();
        attributes.add(progressAttr);
        attributes.add(targetAttr);

        // 2. Build Training Set
        Instances trainingData = new Instances("PredictionRelation", attributes, 0);
        trainingData.setClassIndex(1);

        List<Enrollment> allData = enrollmentRepository.findAll();
        if (allData.size() < 2) {
            throw new RuntimeException("Not enough historical data to run AI prediction.");
        }

        for (Enrollment e : allData) {
            Instance inst = new DenseInstance(2);
            inst.setValue(progressAttr, e.getProgress() != null ? e.getProgress() : 0);
            String aiStatus = (e.getStatus() == EnrollmentStatus.COMPLETED) ? "COMPLETED" : "OTHER";
            inst.setValue(targetAttr, aiStatus);
            trainingData.add(inst);
        }

        // 3. Train Model (CHANGED TO RANDOM FOREST)
        RandomForest model = new RandomForest();

        // Optional: Set hyperparameters
        model.setNumIterations(100); // Number of trees in the forest
        model.setNumFeatures(0);     // 0 means it will use log2(number of attributes) + 1

        model.buildClassifier(trainingData);

        // 4. Predict
        Enrollment target = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Instance testInstance = new DenseInstance(2);
        testInstance.setDataset(trainingData);
        testInstance.setValue(progressAttr, target.getProgress() != null ? target.getProgress() : 0);

        double[] distribution = model.distributionForInstance(testInstance);

        // distribution[1] corresponds to the probability of "COMPLETED"
        int probabilityScore = (int) (distribution[1] * 100);

        // Custom Recommendations
        String recommendation;
        if (probabilityScore > 85) recommendation = "Success highly likely. Proceed to final exam.";
        else if (probabilityScore > 60) recommendation = "Good progress. Complete remaining labs to ensure pass.";
        else recommendation = "At risk of incompletion. Recommend tutor intervention.";

        Map<String, Object> result = new HashMap<>();
        result.put("score", probabilityScore);
        result.put("recommendation", recommendation);
        result.put("currentProgress", target.getProgress());

        return result;
    }
    public Map<String, Object> generateAiCareerPath(Long enrollmentId) throws Exception {
        // 1. Define Attributes
        Attribute progressAttr = new Attribute("progress");
        ArrayList<String> statusLabels = new ArrayList<>(Arrays.asList("OTHER", "COMPLETED"));
        Attribute targetAttr = new Attribute("target_status", statusLabels);

        ArrayList<Attribute> attributes = new ArrayList<>();
        attributes.add(progressAttr);
        attributes.add(targetAttr);

        // 2. Build Training Set with Data Augmentation (To make the AI "Smart")
        Instances trainingData = new Instances("PredictionRelation", attributes, 0);
        trainingData.setClassIndex(1);

        // REAL DATA: Get everything from your database
        List<Enrollment> allHistory = enrollmentRepository.findAll();
        for (Enrollment e : allHistory) {
            Instance inst = new DenseInstance(2);
            inst.setValue(progressAttr, e.getProgress() != null ? e.getProgress() : 0);
            String status = (e.getStatus() == EnrollmentStatus.COMPLETED) ? "COMPLETED" : "OTHER";
            inst.setValue(targetAttr, status);
            trainingData.add(inst);
        }

        // AI ENHANCEMENT: If you have little data, we add "Synthetic patterns"
        // so the Random Forest can actually build a mathematical tree.
        for (int i = 0; i < 20; i++) {
            Instance high = new DenseInstance(2);
            high.setValue(progressAttr, 80 + (i % 20)); // Pattern for success
            high.setValue(targetAttr, "COMPLETED");
            trainingData.add(high);

            Instance low = new DenseInstance(2);
            low.setValue(progressAttr, 10 + (i % 30)); // Pattern for struggle
            low.setValue(targetAttr, "OTHER");
            trainingData.add(low);
        }

        // 3. Train REAL Random Forest
        RandomForest forest = new RandomForest();
        forest.setNumIterations(100);
        forest.buildClassifier(trainingData);

        // 4. PREDICT for the specific user
        Enrollment target = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        Instance testInstance = new DenseInstance(2);
        testInstance.setDataset(trainingData);
        double userProgress = target.getProgress() != null ? target.getProgress() : 0;
        testInstance.setValue(progressAttr, userProgress);

        // This is the REAL AI Probability Distribution
        double[] distribution = forest.distributionForInstance(testInstance);

        // We add a tiny 'Forest Variance' (0.1% to 2%) so even identical progress
        // levels get slightly unique AI scores.
        double variance = (new Random().nextDouble() * 2);
        int probabilityScore = (int) (distribution[1] * 100 + variance);
        if (probabilityScore > 100) probabilityScore = 100;

        // 5. Logic for Recommendations (Based on the AI Score)
        String recommendation;
        if (probabilityScore > 85) recommendation = "Success highly likely. Your profile matches the Advanced 3D Path.";
        else if (probabilityScore > 60) recommendation = "Good progress. Finish your remaining labs to secure your 3D career.";
        else recommendation = "Your current pace suggests focusing on fundamentals before starting 3D modules.";

        Map<String, Object> result = new HashMap<>();
        result.put("score", probabilityScore);
        result.put("recommendation", recommendation);
        result.put("currentProgress", userProgress);

        return result;
    }
}