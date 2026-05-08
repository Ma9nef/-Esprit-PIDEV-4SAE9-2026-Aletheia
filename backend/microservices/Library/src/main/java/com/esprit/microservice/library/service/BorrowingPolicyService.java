package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.BorrowingPolicyDTO;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.UserRole;

import java.time.LocalDate;
import java.util.List;

public interface BorrowingPolicyService {

    /** Returns the policy for a given role (never null – falls back to LEARNER defaults). */
    BorrowingPolicyDTO getPolicyForRole(UserRole role);

    List<BorrowingPolicyDTO> getAllPolicies();

    /** Admin-only: update a policy's parameters. */
    BorrowingPolicyDTO updatePolicy(Long id, BorrowingPolicyDTO dto);

    /**
     * Validates that the user is allowed to borrow the given product.
     * Throws {@link com.esprit.microservice.library.exception.BorrowingException} on any violation.
     */
    void validateBorrowRequest(Long userId, String userRole, Product product);

    /** Returns LocalDate.now() + policy.loanDurationDays for the given role string. */
    LocalDate calculateDueDate(String userRole);
}
