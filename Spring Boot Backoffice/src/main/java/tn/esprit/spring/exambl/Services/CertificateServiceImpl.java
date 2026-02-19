package tn.esprit.spring.exambl.Services;

import com.lowagie.text.PageSize;
import com.lowagie.text.pdf.PdfContentByte;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.spring.exambl.Entity.Certificate;
import tn.esprit.spring.exambl.Entity.Enrollment;
import tn.esprit.spring.exambl.Entity.EnrollmentStatus;
import tn.esprit.spring.exambl.Repository.CertificateRepository;
import tn.esprit.spring.exambl.Repository.EnrollmentRepository;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.IOException;
import java.util.Base64;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CertificateServiceImpl implements ICertificateService {

    @Autowired
    CertificateRepository certificateRepository;

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Override
    public Certificate generateCertificate(Long enrollmentId) {
        // 1. Find the enrollment
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId).orElse(null);

        // 2. CONSTRAINT: Check if Enrollment exists and status is COMPLETED
        if (enrollment != null && EnrollmentStatus.COMPLETED.equals(enrollment.getStatus())) {

            // 3. Check if certificate already exists to avoid duplicates
            Certificate existingCert = certificateRepository.findByEnrollmentId(enrollmentId);
            if (existingCert != null) {
                return existingCert;
            }

            // 4. Create new Certificate
            Certificate certificate = new Certificate();
            certificate.setEnrollment(enrollment);
            // Use LocalDateTime.now() to match the Entity type
            certificate.setIssuedAt(LocalDateTime.now());

            // Generate unique code
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
    public void exportCertificateToPdf(Long certificateId, HttpServletResponse response) throws IOException {
        Certificate cert = certificateRepository.findById(certificateId).orElse(null);

        // Basic Validation
        if (cert == null || cert.getEnrollment() == null || cert.getEnrollment().getUser() == null) {
            return;
        }

        // 1. Create Document (Landscape)
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();

        // 2. Add Decorative Border
        PdfContentByte canvas = PdfWriter.getInstance(document, response.getOutputStream()).getDirectContent();
        Rectangle rect = new Rectangle(document.getPageSize());
        rect.setBorder(Rectangle.BOX);
        rect.setBorderWidth(5);
        rect.setBorderColor(Color.DARK_GRAY);
        rect.setLeft(20);
        rect.setBottom(20);
        rect.setRight(document.getPageSize().getWidth() - 20);
        rect.setTop(document.getPageSize().getHeight() - 20);
        document.add(rect);

        // 3. Set Fonts
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 30, Color.BLUE);
        Font fontName = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 26, Color.BLACK);
        Font fontBody = FontFactory.getFont(FontFactory.HELVETICA, 18, Color.DARK_GRAY);

        // 4. Add Content
        Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION", fontTitle);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingBefore(70);
        document.add(title);

        document.add(new Paragraph("\n")); // Space

        Paragraph p1 = new Paragraph("This is to certify that", fontBody);
        p1.setAlignment(Element.ALIGN_CENTER);
        document.add(p1);

        // FIXED: Using fullName from your User entity
        String studentName = cert.getEnrollment().getUser().getFullName();
        Paragraph pName = new Paragraph(studentName != null ? studentName : "Student Name", fontName);
        pName.setAlignment(Element.ALIGN_CENTER);
        pName.setSpacingBefore(10);
        document.add(pName);

        Paragraph p2 = new Paragraph("has successfully completed all requirements for the certification.", fontBody);
        p2.setAlignment(Element.ALIGN_CENTER);
        p2.setSpacingBefore(10);
        document.add(p2);

        // Certificate Details
        Paragraph pDetails = new Paragraph("\nIssued on: " + cert.getIssuedAt().toLocalDate() +
                "\nCertificate ID: " + cert.getCertificateCode(),
                FontFactory.getFont(FontFactory.HELVETICA, 12));
        pDetails.setAlignment(Element.ALIGN_CENTER);
        pDetails.setSpacingBefore(20);
        document.add(pDetails);


        document.close();
    }
}
