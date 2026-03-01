package com.esprit.microservice.courses.RestController.certificateassesment;

import com.esprit.microservice.courses.entity.Certificate;
import com.esprit.microservice.courses.repository.CertificateRepository;
import com.esprit.microservice.courses.service.core.ICertificateService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pidev/certificate")
@CrossOrigin(origins = "http://localhost:4200")
public class CertificateController {

    @Autowired
    ICertificateService certificateService;
    @Autowired
    CertificateRepository certificateRepository;


    @PostMapping("/generate/{enrollmentId}")
    public ResponseEntity<String> generateCertificate(@PathVariable Long enrollmentId) {
        Certificate cert = certificateService.generateCertificate(enrollmentId);
        return ResponseEntity.ok("Certificat généré avec succès ! Code : " + cert.getCertificateCode());
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
    @PostMapping("/{id}/upload")
    public ResponseEntity<Map<String, String>> upload(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        try {
            // Save the content
            certificateService.savePdfContent(id, file.getBytes());

            // Create a JSON-compatible response
            response.put("message", "File saved in DB: " + file.getOriginalFilename());
            return ResponseEntity.ok(response); // Returns {"message": "..."}

        } catch (IOException e) {
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> download(@PathVariable Long id) {
        // 1. Get the certificate object from database
        Certificate cert = certificateService.getById(id);

        // 2. Check if certificate exists and has content
        if (cert == null || cert.getPdfContent() == null) {
            return ResponseEntity.notFound().build();
        }

        // 3. Return the stored byte array
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"certificate_" + cert.getCertificateCode() + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(cert.getPdfContent());
    }}
