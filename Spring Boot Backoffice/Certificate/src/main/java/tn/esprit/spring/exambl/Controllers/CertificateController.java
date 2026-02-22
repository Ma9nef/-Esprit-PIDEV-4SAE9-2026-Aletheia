package tn.esprit.spring.exambl.Controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Certificate;
import tn.esprit.spring.exambl.Repository.CertificateRepository;
import tn.esprit.spring.exambl.Services.ICertificateService;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/certificate")
@CrossOrigin(origins = "http://localhost:4200")
public class CertificateController {

    @Autowired
    ICertificateService certificateService;
    @Autowired
    CertificateRepository certificateRepository;



    @PostMapping("/generate/{enrollmentId}")
    public Certificate generateCertificate(@PathVariable Long enrollmentId) {
        return certificateService.generateCertificate(enrollmentId);
    }

    // URL: GET http://localhost:8080/certificate/all
    @GetMapping("/all")
    public List<Certificate> getAllCertificates() {
        return certificateService.getAllCertificates();
    }
    @PutMapping("/update/{id}")
    public Certificate updateCertificate(@PathVariable Long id, @RequestBody Certificate certificate) {
        Certificate existing = certificateRepository.findById(id).orElse(null);

        if (existing != null) {
            // 1. Update the Code
            existing.setCertificateCode(certificate.getCertificateCode());

            // 2. Update the Date (IMPORTANT)
            existing.setIssuedAt(certificate.getIssuedAt());

            // 3. Update the Enrollment Reference
            if (certificate.getEnrollment() != null) {
                existing.setEnrollment(certificate.getEnrollment());
            }

            // 4. Save to Database
            return certificateRepository.save(existing);
        }
        return null;
    }
    // URL: GET http://localhost:8080/certificate/verify/CERT-ABCD123
    @GetMapping("/verify/{code}")
    public Certificate verifyCertificate(@PathVariable String code) {
        return certificateService.getByCode(code);
    }
    @GetMapping("/export-modern/{id}")
    public void exportModern(@PathVariable Long id, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=Certificate_Verified.pdf";
        response.setHeader(headerKey, headerValue);

        certificateService.exportModernCertificate(id, response);
    }
    @GetMapping("/analytics")
    public Map<String, Object> getStats() {
        return certificateService.getCertificationAnalytics();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCertificate(@PathVariable Long id) {
        certificateService.deleteCertificate(id);
        // Return 204 No Content (Standard for Delete)
        return ResponseEntity.noContent().build();
    }
}
