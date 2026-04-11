    package com.esprit.microservice.courses.RestController.certificateassesment;

    import com.esprit.microservice.courses.entity.Certificate;
    import com.esprit.microservice.courses.repository.CertificateRepository;
    import com.esprit.microservice.courses.security.JwtReader;
    import com.esprit.microservice.courses.service.core.ICertificateService;
    import jakarta.servlet.http.HttpServletResponse;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
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
    public class CertificateController {
    //bearer token : eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBhZG1pbi5jb20iLCJyb2xlIjoiQURNSU4iLCJpZCI6MSwibmFtZSI6IkFkbWluIFN5c3RlbSIsImlhdCI6MTc3NTE1NzQ0MSwiZXhwIjoxNzc1MjQzODQxfQ.41kUI2TmaovnBqgGJ20X8Pcey5GXkdDMki4IYq09JQk
        private final ICertificateService certificateService;
        private final CertificateRepository certificateRepository;
        private final JwtReader jwtReader;

        public CertificateController(ICertificateService certificateService,
                                     CertificateRepository certificateRepository,
                                     JwtReader jwtReader) {
            this.certificateService = certificateService;
            this.certificateRepository = certificateRepository;
            this.jwtReader = jwtReader;
        }

        // ──────────────────────────────────────────────
        // Generate certificate for an enrollment
        // POST /pidev/certificate/generate/{enrollmentId}
        // ──────────────────────────────────────────────
        @PostMapping("/generate/{enrollmentId}")
        public ResponseEntity<?> generateCertificate(
                @PathVariable Long enrollmentId,
                @RequestHeader("Authorization") String authorization) {

            Long userId = jwtReader.extractUserId(authorization);

            try {
                Certificate cert = certificateService.generateCertificate(enrollmentId);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Certificat généré avec succès !");
                response.put("code", cert.getCertificateCode());
                response.put("id", cert.getId());
                response.put("generatedBy", userId);
                return ResponseEntity.ok(response);
            } catch (RuntimeException e) {
                Map<String, String> error = new HashMap<>();
                error.put("error", e.getMessage());
                return ResponseEntity.status(400).body(error);
            }
        }

        // ──────────────────────────────────────────────
        // Get all certificates (admin use)
        // GET /pidev/certificate/all
        // ──────────────────────────────────────────────
        @GetMapping("/all")
        public ResponseEntity<List<Certificate>> getAllCertificates(
                @RequestHeader("Authorization") String authorization) {

            // Extract userId if you need role-based filtering in the future
            jwtReader.extractUserId(authorization);
            return ResponseEntity.ok(certificateService.getAllCertificates());
        }

        // ──────────────────────────────────────────────
        // Update a certificate
        // PUT /pidev/certificate/update/{id}
        // ──────────────────────────────────────────────
        @PutMapping("/update/{id}")
        public ResponseEntity<Certificate> updateCertificate(
                @PathVariable Long id,
                @RequestBody Certificate certificate,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            Certificate existing = certificateRepository.findById(id).orElse(null);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }

            existing.setCertificateCode(certificate.getCertificateCode());
            existing.setIssuedAt(certificate.getIssuedAt());

            if (certificate.getEnrollment() != null) {
                existing.setEnrollment(certificate.getEnrollment());
            }

            return ResponseEntity.ok(certificateRepository.save(existing));
        }

        // ──────────────────────────────────────────────
        // Verify a certificate by code (public — no JWT needed)
        // GET /pidev/certificate/verify/{code}
        // ──────────────────────────────────────────────
        @GetMapping("/verify/{code}")
        public ResponseEntity<Certificate> verifyCertificate(@PathVariable String code) {
            Certificate cert = certificateService.getByCode(code);
            if (cert == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(cert);
        }

        // ──────────────────────────────────────────────
        // Export modern PDF certificate
        // GET /pidev/certificate/export-modern/{id}
        // ──────────────────────────────────────────────
        @GetMapping("/export-modern/{id}")
        public void exportModern(
                @PathVariable Long id,
                HttpServletResponse response,
                @RequestHeader("Authorization") String authorization) throws IOException {

            jwtReader.extractUserId(authorization);

            response.setContentType("application/pdf");
            response.setHeader("Content-Disposition", "attachment; filename=Certificate_Verified.pdf");
            certificateService.exportModernCertificate(id, response);
        }

        // ──────────────────────────────────────────────
        // Certification analytics
        // GET /pidev/certificate/analytics
        // ──────────────────────────────────────────────
        @GetMapping("/analytics")
        public ResponseEntity<Map<String, Object>> getStats(
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);
            return ResponseEntity.ok(certificateService.getCertificationAnalytics());
        }

        // ──────────────────────────────────────────────
        // Delete a certificate
        // DELETE /pidev/certificate/{id}
        // ──────────────────────────────────────────────
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteCertificate(
                @PathVariable Long id,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);
            certificateService.deleteCertificate(id);
            return ResponseEntity.noContent().build();
        }

        // ──────────────────────────────────────────────
        // Upload PDF content for a certificate
        // POST /pidev/certificate/{id}/upload
        // ──────────────────────────────────────────────
        @PostMapping("/{id}/upload")
        public ResponseEntity<Map<String, String>> upload(
                @PathVariable Long id,
                @RequestParam("file") MultipartFile file,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            Map<String, String> response = new HashMap<>();
            try {
                certificateService.savePdfContent(id, file.getBytes());
                response.put("message", "File saved in DB: " + file.getOriginalFilename());
                return ResponseEntity.ok(response);
            } catch (IOException e) {
                response.put("error", e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        // ──────────────────────────────────────────────
        // Send certificate by email
        // POST /pidev/certificate/{id}/send-email
        // ──────────────────────────────────────────────
        @PostMapping("/{id}/send-email")
        public ResponseEntity<Map<String, String>> sendCertificateEmail(
                @PathVariable Long id,
                @RequestBody Map<String, String> request,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            String recipientEmail = request.get("email");
            Map<String, String> response = new HashMap<>();
            try {
                certificateService.sendCertificateByEmail(id, recipientEmail);
                response.put("message", "Email sent successfully to " + recipientEmail);
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                response.put("error", "Failed to send email: " + e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
        }

        // ──────────────────────────────────────────────
        // AI — Predict certification success
        // GET /pidev/certificate/predict/{enrollmentId}
        // ──────────────────────────────────────────────
        @GetMapping("/predict/{enrollmentId}")
        public ResponseEntity<Map<String, Object>> predictSuccess(
                @PathVariable Long enrollmentId,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            try {
                Map<String, Object> aiResult = certificateService.predictCertificationSuccess(enrollmentId);
                return ResponseEntity.ok(aiResult);
            } catch (Exception e) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "AI Engine Error: " + e.getMessage());
                return ResponseEntity.status(500).body(error);
            }
        }

        // ──────────────────────────────────────────────
        // AI — Generate career path
        // GET /pidev/certificate/{enrollmentId}/ai-path
        // ──────────────────────────────────────────────
        @GetMapping("/{enrollmentId}/ai-path")
        public ResponseEntity<Map<String, Object>> getAiCareerPath(
                @PathVariable Long enrollmentId,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            try {
                Map<String, Object> prediction = certificateService.generateAiCareerPath(enrollmentId);
                return ResponseEntity.ok(prediction);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        // ──────────────────────────────────────────────
        // Download certificate PDF
        // GET /pidev/certificate/{id}/download
        // ──────────────────────────────────────────────
        @GetMapping("/{id}/download")
        public ResponseEntity<byte[]> download(
                @PathVariable Long id,
                @RequestHeader("Authorization") String authorization) {

            jwtReader.extractUserId(authorization);

            Certificate cert = certificateService.getById(id);
            if (cert == null || cert.getPdfContent() == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"certificate_" + cert.getCertificateCode() + ".pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(cert.getPdfContent());
        }
    }