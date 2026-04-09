package com.esprit.microservice.library.repository;

import com.esprit.microservice.library.entity.Loan;
import com.esprit.microservice.library.enums.LoanStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // ── User-scoped queries ────────────────────────────────────────────────────

    List<Loan> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT l FROM Loan l WHERE l.userId = :userId AND l.status IN ('ACTIVE', 'OVERDUE')")
    List<Loan> findActiveLoansByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.userId = :userId AND l.status IN ('ACTIVE', 'OVERDUE')")
    long countActiveLoansByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(l.fineAmount), 0.0) FROM Loan l WHERE l.userId = :userId AND l.finePaid = false")
    Double sumUnpaidFinesByUserId(@Param("userId") Long userId);

    // ── Overdue detection (used by scheduler) ─────────────────────────────────

    @Query("SELECT l FROM Loan l WHERE l.status = 'ACTIVE' AND l.dueDate < :today")
    List<Loan> findLoansToMarkOverdue(@Param("today") LocalDate today);

    /** Loans due on the given date — used to send 24-hour deadline reminders. */
    @Query("SELECT l FROM Loan l WHERE l.status = 'ACTIVE' AND l.dueDate = :dueDate")
    List<Loan> findActiveLoansDueOn(@Param("dueDate") LocalDate dueDate);

    // ── Status-based ──────────────────────────────────────────────────────────

    List<Loan> findByStatus(LoanStatus status);

    long countByStatus(LoanStatus status);

    // ── Analytics: most / least borrowed ──────────────────────────────────────

    @Query("SELECT l.product, COUNT(l) AS cnt FROM Loan l GROUP BY l.product ORDER BY cnt DESC")
    List<Object[]> findTopBorrowedProducts(Pageable pageable);

    /**
     * Returns all products joined with their borrow count (including 0).
     * Used for "least borrowed" and "underutilized" detection.
     */
    @Query("""
            SELECT p, COUNT(l) AS cnt
            FROM com.esprit.microservice.library.entity.Product p
            LEFT JOIN com.esprit.microservice.library.entity.Loan l ON l.product = p
            GROUP BY p
            ORDER BY cnt ASC
            """)
    List<Object[]> findAllProductsWithBorrowCount(Pageable pageable);

    // ── Analytics: trends ─────────────────────────────────────────────────────

    @Query("SELECT YEAR(l.borrowDate), MONTH(l.borrowDate), COUNT(l) " +
           "FROM Loan l WHERE YEAR(l.borrowDate) = :year " +
           "GROUP BY YEAR(l.borrowDate), MONTH(l.borrowDate) " +
           "ORDER BY MONTH(l.borrowDate)")
    List<Object[]> findBorrowTrendsByYear(@Param("year") int year);

    // ── Analytics: high-demand (no stock, still borrowed) ─────────────────────

    @Query("SELECT l.product, COUNT(l) AS cnt FROM Loan l " +
           "WHERE l.product.stockQuantity = 0 AND l.status IN ('ACTIVE', 'OVERDUE') " +
           "GROUP BY l.product ORDER BY cnt DESC")
    List<Object[]> findHighDemandProducts();

    // ── Analytics: underutilized ──────────────────────────────────────────────

    @Query("SELECT p FROM com.esprit.microservice.library.entity.Product p " +
           "WHERE p.id NOT IN " +
           "(SELECT DISTINCT l2.product.id FROM Loan l2 WHERE l2.borrowDate >= :cutoff)")
    List<com.esprit.microservice.library.entity.Product> findUnderutilizedProducts(
            @Param("cutoff") LocalDate cutoff);

    // ── Totals ────────────────────────────────────────────────────────────────

    @Query("SELECT COALESCE(SUM(l.fineAmount), 0.0) FROM Loan l WHERE l.finePaid = false")
    Double sumAllUnpaidFines();

    Optional<Loan> findByIdAndUserId(Long id, Long userId);
}
