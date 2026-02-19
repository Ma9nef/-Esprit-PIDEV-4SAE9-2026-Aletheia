package tn.esprit.spring.exambl.Services;

import jakarta.servlet.http.HttpServletResponse;
import tn.esprit.spring.exambl.Entity.Certificate;

import java.io.IOException;
import java.util.List;

    public interface ICertificateService {
        Certificate generateCertificate(Long enrollmentId);
        List<Certificate> getAllCertificates();
        Certificate getByCode(String code);
        void exportCertificateToPdf(Long certificateId, HttpServletResponse response) throws IOException;


    }
