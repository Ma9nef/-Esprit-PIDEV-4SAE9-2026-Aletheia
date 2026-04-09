package com.esprit.microservice.library.config;

import com.esprit.microservice.library.entity.BorrowingPolicy;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.enums.UserRole;
import com.esprit.microservice.library.repository.BorrowingPolicyRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Set;

/**
 * Seeds the three default borrowing policies on startup if they don't exist yet.
 *
 * | Role       | Max loans | Loan period | Fine/day | Block threshold | Restricted types       |
 * |------------|-----------|-------------|----------|-----------------|------------------------|
 * | LEARNER    | 3         | 14 days     | $0.50    | $10.00          | PDF, EXAM              |
 * | INSTRUCTOR | 7         | 30 days     | $0.25    | $20.00          | PDF                    |
 * | ADMIN      | 15        | 90 days     | $0.00    | $0 (no block)   | (none)                 |
 */
@Component
@Order(2)
public class PolicyDataInitializer implements ApplicationRunner {

    private final BorrowingPolicyRepository policyRepo;

    public PolicyDataInitializer(BorrowingPolicyRepository policyRepo) {
        this.policyRepo = policyRepo;
    }

    @Override
    public void run(ApplicationArguments args) {
        seedIfAbsent(UserRole.LEARNER,    3,  14, 0.50, 10.00,
                Set.of(ProductType.PDF, ProductType.EXAM));

        seedIfAbsent(UserRole.INSTRUCTOR, 7,  30, 0.25, 20.00,
                Set.of(ProductType.PDF));

        seedIfAbsent(UserRole.ADMIN,     15,  90, 0.00,  0.00,
                Set.of());
    }

    private void seedIfAbsent(UserRole role, int maxBorrows, int durationDays,
                               double fineRate, double fineBlock,
                               Set<ProductType> restricted) {
        if (!policyRepo.existsByUserRole(role)) {
            policyRepo.save(new BorrowingPolicy(
                    role, maxBorrows, durationDays, fineRate, fineBlock, restricted));
        }
    }
}
