package com.esprit.microservice.library.repository;

import com.esprit.microservice.library.entity.BorrowingPolicy;
import com.esprit.microservice.library.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BorrowingPolicyRepository extends JpaRepository<BorrowingPolicy, Long> {

    Optional<BorrowingPolicy> findByUserRole(UserRole userRole);

    boolean existsByUserRole(UserRole userRole);
}
