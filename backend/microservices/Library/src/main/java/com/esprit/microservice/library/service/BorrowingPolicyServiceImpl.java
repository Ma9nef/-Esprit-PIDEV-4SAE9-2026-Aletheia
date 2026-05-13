package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.BorrowingPolicyDTO;
import com.esprit.microservice.library.entity.BorrowingPolicy;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.UserRole;
import com.esprit.microservice.library.exception.BorrowingException;
import com.esprit.microservice.library.repository.BorrowingPolicyRepository;
import com.esprit.microservice.library.repository.LoanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowingPolicyServiceImpl implements BorrowingPolicyService {

    private final BorrowingPolicyRepository policyRepo;
    private final LoanRepository loanRepo;

    public BorrowingPolicyServiceImpl(BorrowingPolicyRepository policyRepo,
                                      LoanRepository loanRepo) {
        this.policyRepo = policyRepo;
        this.loanRepo = loanRepo;
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    public BorrowingPolicyDTO getPolicyForRole(UserRole role) {
        return policyRepo.findByUserRole(role)
                .map(this::toDTO)
                .orElseThrow(() -> new BorrowingException(
                        "No borrowing policy configured for role: " + role));
    }

    @Override
    public List<BorrowingPolicyDTO> getAllPolicies() {
        return policyRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ── Update (admin) ────────────────────────────────────────────────────────

    @Override
    @Transactional
    public BorrowingPolicyDTO updatePolicy(Long id, BorrowingPolicyDTO dto) {
        BorrowingPolicy policy = policyRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Policy not found: " + id));
        policy.setMaxActiveBorrows(dto.getMaxActiveBorrows());
        policy.setLoanDurationDays(dto.getLoanDurationDays());
        policy.setFineRatePerDay(dto.getFineRatePerDay());
        policy.setMaxFineBlockThreshold(dto.getMaxFineBlockThreshold());
        if (dto.getRestrictedProductTypes() != null) {
            policy.setRestrictedProductTypes(dto.getRestrictedProductTypes());
        }
        return toDTO(policyRepo.save(policy));
    }

    // ── Validation ────────────────────────────────────────────────────────────

    @Override
    public void validateBorrowRequest(Long userId, String userRoleStr, Product product) {
        UserRole role = parseRole(userRoleStr);
        BorrowingPolicy policy = policyRepo.findByUserRole(role)
                .orElseThrow(() -> new BorrowingException(
                        "No borrowing policy for role: " + userRoleStr));

        // 1. Product type restriction
        if (policy.getRestrictedProductTypes().contains(product.getType())) {
            throw new BorrowingException(
                    "'" + product.getType() + "' items cannot be borrowed with your account type.");
        }

        // 2. Physical availability check
        if (product.getStockQuantity() == null || product.getStockQuantity() <= 0) {
            throw new BorrowingException(
                    "'" + product.getTitle() + "' is currently out of stock.");
        }

        // 3. Concurrent borrow limit
        long activeBorrows = loanRepo.countActiveLoansByUserId(userId);
        if (activeBorrows >= policy.getMaxActiveBorrows()) {
            throw new BorrowingException(
                    "You have reached the maximum of " + policy.getMaxActiveBorrows()
                    + " concurrent loans for your account type.");
        }

        // 4. Unpaid fines threshold (0 threshold means no blocking)
        if (policy.getMaxFineBlockThreshold() > 0) {
            Double unpaidFines = loanRepo.sumUnpaidFinesByUserId(userId);
            double totalFines = unpaidFines != null ? unpaidFines : 0.0;
            if (totalFines > policy.getMaxFineBlockThreshold()) {
                throw new BorrowingException(
                        String.format("Borrowing blocked: you have %.2f in unpaid fines "
                                + "(threshold: %.2f). Please pay your fines first.",
                                totalFines, policy.getMaxFineBlockThreshold()));
            }
        }
    }

    @Override
    public LocalDate calculateDueDate(String userRoleStr) {
        UserRole role = parseRole(userRoleStr);
        BorrowingPolicy policy = policyRepo.findByUserRole(role)
                .orElseThrow(() -> new BorrowingException(
                        "No borrowing policy for role: " + userRoleStr));
        return LocalDate.now().plusDays(policy.getLoanDurationDays());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private UserRole parseRole(String roleStr) {
        try {
            return UserRole.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Unknown roles get LEARNER defaults (most restrictive)
            return UserRole.LEARNER;
        }
    }

    private BorrowingPolicyDTO toDTO(BorrowingPolicy p) {
        BorrowingPolicyDTO dto = new BorrowingPolicyDTO();
        dto.setId(p.getId());
        dto.setUserRole(p.getUserRole());
        dto.setMaxActiveBorrows(p.getMaxActiveBorrows());
        dto.setLoanDurationDays(p.getLoanDurationDays());
        dto.setFineRatePerDay(p.getFineRatePerDay());
        dto.setMaxFineBlockThreshold(p.getMaxFineBlockThreshold());
        dto.setRestrictedProductTypes(p.getRestrictedProductTypes());
        return dto;
    }
}
