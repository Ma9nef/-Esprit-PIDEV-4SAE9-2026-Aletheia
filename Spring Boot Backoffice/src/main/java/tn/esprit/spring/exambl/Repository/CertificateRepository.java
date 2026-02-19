package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.spring.exambl.Entity.Certificate;

import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    // Find a certificate by its unique code
    Optional<Certificate> findByCertificateCode(String code);



    Certificate findByEnrollmentId(Long enrollmentId);
}
