package com.esprit.microservice.library.entity;

import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.enums.UserRole;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

/**
 * Defines borrowing rules for each user role.
 * One row per UserRole – loaded at startup via PolicyDataInitializer.
 */

@Entity
@Table(name = "borrowing_policies")
public class BorrowingPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private UserRole userRole;

    /** Maximum number of concurrently active / overdue loans. */
    @Column(nullable = false)
    private int maxActiveBorrows;

    /** Default loan period in days (used to compute due date). */
    @Column(nullable = false)
    private int loanDurationDays;

    /** Fine charged per day after the due date (in currency units). */
    @Column(nullable = false)
    private double fineRatePerDay;

    /**
     * Unpaid-fine amount above which new borrows are blocked.
     * 0 means fines never block (e.g. ADMIN).
     */
    @Column(nullable = false)
    private double maxFineBlockThreshold;

    /**
     * Product types that this role is NOT allowed to borrow.
     * e.g. LEARNER cannot borrow PDF or EXAM items.
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "policy_restricted_types",
            joinColumns = @JoinColumn(name = "policy_id")
    )
    @Column(name = "product_type")
    @Enumerated(EnumType.STRING)
    private Set<ProductType> restrictedProductTypes = new HashSet<>();

    // ── Constructors ──────────────────────────────────────────────────────────

    public BorrowingPolicy() {}

    public BorrowingPolicy(UserRole userRole,
                           int maxActiveBorrows,
                           int loanDurationDays,
                           double fineRatePerDay,
                           double maxFineBlockThreshold,
                           Set<ProductType> restrictedProductTypes) {
        this.userRole = userRole;
        this.maxActiveBorrows = maxActiveBorrows;
        this.loanDurationDays = loanDurationDays;
        this.fineRatePerDay = fineRatePerDay;
        this.maxFineBlockThreshold = maxFineBlockThreshold;
        this.restrictedProductTypes = restrictedProductTypes != null ? restrictedProductTypes : new HashSet<>();
    }

    // ── Getters / Setters ─────────────────────────────────────────────────────

    public Long getId() { return id; }

    public UserRole getUserRole() { return userRole; }
    public void setUserRole(UserRole userRole) { this.userRole = userRole; }

    public int getMaxActiveBorrows() { return maxActiveBorrows; }
    public void setMaxActiveBorrows(int maxActiveBorrows) { this.maxActiveBorrows = maxActiveBorrows; }

    public int getLoanDurationDays() { return loanDurationDays; }
    public void setLoanDurationDays(int loanDurationDays) { this.loanDurationDays = loanDurationDays; }

    public double getFineRatePerDay() { return fineRatePerDay; }
    public void setFineRatePerDay(double fineRatePerDay) { this.fineRatePerDay = fineRatePerDay; }

    public double getMaxFineBlockThreshold() { return maxFineBlockThreshold; }
    public void setMaxFineBlockThreshold(double maxFineBlockThreshold) {
        this.maxFineBlockThreshold = maxFineBlockThreshold;
    }

    public Set<ProductType> getRestrictedProductTypes() { return restrictedProductTypes; }
    public void setRestrictedProductTypes(Set<ProductType> restrictedProductTypes) {
        this.restrictedProductTypes = restrictedProductTypes;
    }
}
