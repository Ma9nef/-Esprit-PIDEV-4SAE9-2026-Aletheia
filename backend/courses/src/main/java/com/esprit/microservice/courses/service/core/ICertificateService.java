package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.Certificate;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ICertificateService {
        Certificate generateCertificate(Long enrollmentId);
        List<Certificate> getAllCertificates();
        Certificate getByCode(String code);

    void sendCertificateByEmail(Long certificateId, String recipientEmail) throws MessagingException;

    Certificate getById(Long id);
    // --- ADVANCED MÉTIER 1: Modern PDF with QR-Code Verification ---
    // This provides "Trust" to the business by preventing forged certificates.
    void exportModernCertificate(Long certificateId, HttpServletResponse response) throws IOException;

    // --- ADVANCED MÉTIER 2: Business Success Analytics ---
    // This helps the Admin see the ROI (Return on Investment) of the learning platform.
    Map<String, Object> getCertificationAnalytics();

    void deleteCertificate(Long id);

    void savePdfContent(Long id, byte[] bytes);

}
