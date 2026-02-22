package tn.esprit.spring.exambl.Services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Use Spring Transactional
import tn.esprit.spring.exambl.Entity.Certificate;
import tn.esprit.spring.exambl.Entity.Enrollment;
import tn.esprit.spring.exambl.Entity.EnrollmentStatus;
import tn.esprit.spring.exambl.Repository.CertificateRepository;
import tn.esprit.spring.exambl.Repository.EnrollmentRepository;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.List;

@Service
public class CertificateServiceImpl implements ICertificateService {

    @Autowired
    CertificateRepository certificateRepository;

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Override
    public Certificate generateCertificate(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);

        if (enrollment != null && EnrollmentStatus.COMPLETED.equals(enrollment.getStatus())) {
            Certificate existingCert = certificateRepository.findByEnrollmentId(enrollmentId);
            if (existingCert != null) {
                return existingCert;
            }

            Certificate certificate = new Certificate();
            certificate.setEnrollment(enrollment);
            certificate.setIssuedAt(LocalDate.now());
            certificate.setCertificateCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            return certificateRepository.save(certificate);
        }
        return null;
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
        Certificate cert = certificateRepository.findById(certificateId).orElse(null);
        if (cert == null) return;

        Document document = new Document(PageSize.A4.rotate());
        PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        PdfContentByte canvas = writer.getDirectContent();
        Rectangle rect = new Rectangle(document.getPageSize());
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(15);
        rect.setBorderColor(new Color(218, 165, 32));
        canvas.rectangle(rect);
        canvas.stroke();

        Font fontTitle = FontFactory.getFont(FontFactory.TIMES_BOLD, 45, new Color(44, 62, 80));
        Paragraph title = new Paragraph("CERTIFICATE OF ACHIEVEMENT", fontTitle);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(40);
        document.add(title);

        document.add(new Paragraph("\n"));

        String name = cert.getEnrollment().getUser() != null ? cert.getEnrollment().getUser().getFullName() : "Valued Learner";
        Font fontName = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 40, new Color(184, 134, 11));
        Paragraph pName = new Paragraph(name, fontName);
        pName.setAlignment(Element.ALIGN_CENTER);
        document.add(pName);

        Font fontText = FontFactory.getFont(FontFactory.HELVETICA, 16, Color.DARK_GRAY);
        Paragraph pDesc = new Paragraph("has successfully demonstrated proficiency and completed all requirements for the certification of excellence.", fontText);
        pDesc.setAlignment(Element.ALIGN_CENTER);
        pDesc.setSpacingBefore(20);
        document.add(pDesc);

        try {
            String verifyUrl = "http://localhost:4200/verify/" + cert.getCertificateCode();
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(verifyUrl, BarcodeFormat.QR_CODE, 130, 130);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);

            Image qrImage = Image.getInstance(pngOutputStream.toByteArray());
            qrImage.setAbsolutePosition(680, 60);
            document.add(qrImage);

            Font fontSmall = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY);
            Paragraph label = new Paragraph("Scan to Verify: " + cert.getCertificateCode(), fontSmall);
            label.setAlignment(Element.ALIGN_RIGHT);
            label.setIndentationRight(30);
            document.add(label);
        } catch (Exception e) {
            System.err.println("QR Generation Error: " + e.getMessage());
        }

        Font fontDate = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
        Paragraph pDate = new Paragraph("\n\nDate of Issue: " + cert.getIssuedAt(), fontDate);
        pDate.setIndentationLeft(50);
        document.add(pDate);

        document.close();
    }

    @Override
    public Map<String, Object> getCertificationAnalytics() {
        long totalEnrollments = enrollmentRepository.count();
        long totalCertificates = certificateRepository.count();
        double successRate = (totalEnrollments > 0) ? ((double) totalCertificates / totalEnrollments) * 100 : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("total_students", totalEnrollments);
        stats.put("total_issued", totalCertificates);
        stats.put("success_rate", Math.round(successRate * 100.0) / 100.0);

        return stats;
    }

    @Override
    @Transactional // Ensure this is org.springframework.transaction.annotation.Transactional
    public void deleteCertificate(Long id) {
        System.out.println("LOG: Executing custom delete for ID: " + id);

        // Instead of the standard deleteById, use our custom one
        certificateRepository.deleteByIdCustom(id);

        // This line forces Hibernate to talk to MySQL right now
        certificateRepository.flush();

        System.out.println("LOG: Custom delete and Flush completed.");
    }
}