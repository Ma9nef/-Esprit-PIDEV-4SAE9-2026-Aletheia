package tn.esprit.spring.exambl.Controllers;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Certificate;
import tn.esprit.spring.exambl.Services.ICertificateService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/certificate")
@CrossOrigin("*")
public class CertificateController {

    @Autowired
    ICertificateService certificateService;


    @PostMapping("/generate/{enrollmentId}")
    public Certificate generateCertificate(@PathVariable Long enrollmentId) {
        return certificateService.generateCertificate(enrollmentId);
    }

    // URL: GET http://localhost:8080/certificate/all
    @GetMapping("/all")
    public List<Certificate> getAllCertificates() {
        return certificateService.getAllCertificates();
    }

    // URL: GET http://localhost:8080/certificate/verify/CERT-ABCD123
    @GetMapping("/verify/{code}")
    public Certificate verifyCertificate(@PathVariable String code) {
        return certificateService.getByCode(code);
    }
    @GetMapping("/download/{id}")
    public void downloadPdf(@PathVariable Long id, HttpServletResponse response) throws IOException {
        response.setContentType("Aletheia/pdf");

        // Set filename in browser download dialog
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=certificate_" + id + ".pdf";
        response.setHeader(headerKey, headerValue);

        certificateService.exportCertificateToPdf(id, response);
    }
}
