package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.Certificate;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    // Find a certificate by its unique code
    Optional<Certificate> findByCertificateCode(String code);


    @Modifying
    @Transactional
    @Query("DELETE FROM Certificate c WHERE c.id = :id")
    void deleteByIdCustom(@Param("id") Long id);
    Certificate findByEnrollmentId(Long enrollmentId);
}
