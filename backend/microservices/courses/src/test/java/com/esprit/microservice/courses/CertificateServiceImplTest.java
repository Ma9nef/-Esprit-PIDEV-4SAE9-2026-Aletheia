package com.esprit.microservice.courses;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import com.esprit.microservice.courses.entity.Certificate;
import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.esprit.microservice.courses.entity.progress.EnrollmentStatus;
import com.esprit.microservice.courses.repository.CertificateRepository;
import com.esprit.microservice.courses.repository.EnrollmentRepository;
import com.esprit.microservice.courses.service.core.CertificateServiceImpl;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CertificateServiceImplTest {

    @Mock
    private CertificateRepository certificateRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private CertificateServiceImpl certificateService;

    // 1. TEST : GÉNÉRATION RÉUSSIE
    @Test
    void shouldGenerateCertificate_WhenEnrollmentIsCompleted() {
        Long enrollmentId = 1L;
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStatus(EnrollmentStatus.COMPLETED);

        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));
        when(certificateRepository.findByEnrollmentId(enrollmentId)).thenReturn(null);
        when(certificateRepository.save(any(Certificate.class))).thenAnswer(i -> i.getArguments()[0]);

        Certificate result = certificateService.generateCertificate(enrollmentId);

        assertNotNull(result);
        assertNotNull(result.getCertificateCode());
        assertTrue(result.getCertificateCode().startsWith("CERT-"));
        verify(certificateRepository, times(1)).save(any(Certificate.class));
    }

    @ParameterizedTest
// On demande à JUnit de tester TOUS les statuts de l'énumération SAUF "COMPLETED"
    @EnumSource(value = EnrollmentStatus.class, names = {"COMPLETED"}, mode = EnumSource.Mode.EXCLUDE)
    void shouldThrowException_WhenEnrollmentStatusIsNotCompleted(EnrollmentStatus invalidStatus) {
        // 1. ARRANGE
        Long enrollmentId = 1L;
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);

        // JUnit va injecter tour à tour : ACTIVE, CANCELLED, ENROLLED, DROPPED
        enrollment.setStatus(invalidStatus);

        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));

        // 2. ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            certificateService.generateCertificate(enrollmentId);
        });

        // 3. VERIFY
        assertTrue(exception.getMessage().contains("pas encore terminée"),
                "L'erreur devrait être lancée pour le statut : " + invalidStatus);

        verify(certificateRepository, never()).save(any());
    }
    // 3. TEST : ENVOI D'EMAIL (S'assure que le mailSender est bien appelé)
    @Test
    void shouldSendEmail_WhenCertificateExists() throws Exception {
        Long certId = 10L;
        Certificate cert = new Certificate();
        cert.setId(certId);
        cert.setPdfContent("fake pdf content".getBytes());
        cert.setCertificateCode("CERT-123");

        MimeMessage mockMimeMessage = mock(MimeMessage.class);

        when(certificateRepository.findById(certId)).thenReturn(Optional.of(cert));
        when(mailSender.createMimeMessage()).thenReturn(mockMimeMessage);

        certificateService.sendCertificateByEmail(certId, "test@example.com");

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    // 4. TEST : IA PRÉDICTION (Vérifie la sécurité si pas de données)
    @Test
    void shouldThrowException_WhenNoDataForAI() {
        // On simule une base vide (0 inscriptions)
        when(enrollmentRepository.findAll()).thenReturn(new ArrayList<>());

        assertThrows(RuntimeException.class, () -> {
            certificateService.predictCertificationSuccess(1L);
        });
    }
}