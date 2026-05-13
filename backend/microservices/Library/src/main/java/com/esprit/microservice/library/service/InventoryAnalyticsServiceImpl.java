package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.*;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.LoanStatus;
import com.esprit.microservice.library.repository.LoanRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Year;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryAnalyticsServiceImpl implements InventoryAnalyticsService {

    private static final int UNDERUTILIZED_DAYS = 90;

    private final LoanRepository loanRepo;

    public InventoryAnalyticsServiceImpl(LoanRepository loanRepo) {
        this.loanRepo = loanRepo;
    }

    // ── Top / Least borrowed ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<TopProductDTO> getTopBorrowedProducts(int limit) {
        return loanRepo.findTopBorrowedProducts(PageRequest.of(0, limit))
                .stream()
                .map(row -> {
                    Product p = (Product) row[0];
                    long count = ((Number) row[1]).longValue();
                    return new TopProductDTO(
                            p.getId(), p.getTitle(), p.getAuthor(),
                            p.getType(), count, p.getStockQuantity());
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopProductDTO> getLeastBorrowedProducts(int limit) {
        return loanRepo.findAllProductsWithBorrowCount(PageRequest.of(0, limit))
                .stream()
                .map(row -> {
                    Product p = (Product) row[0];
                    long count = ((Number) row[1]).longValue();
                    return new TopProductDTO(
                            p.getId(), p.getTitle(), p.getAuthor(),
                            p.getType(), count, p.getStockQuantity());
                })
                .collect(Collectors.toList());
    }

    // ── Trends ────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<BorrowTrendDTO> getBorrowTrends(int year) {
        return loanRepo.findBorrowTrendsByYear(year)
                .stream()
                .map(row -> new BorrowTrendDTO(
                        ((Number) row[0]).intValue(),
                        ((Number) row[1]).intValue(),
                        ((Number) row[2]).longValue()))
                .collect(Collectors.toList());
    }

    // ── High demand ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<InventoryInsightDTO> getHighDemandInsights() {
        return loanRepo.findHighDemandProducts()
                .stream()
                .map(row -> {
                    Product p = (Product) row[0];
                    long count = ((Number) row[1]).longValue();
                    return new InventoryInsightDTO(
                            p.getId(), p.getTitle(), p.getType(),
                            InventoryInsightDTO.InsightType.INCREASE_COPIES,
                            "Currently out of stock with " + count + " active loan(s). Consider adding more copies.",
                            count, p.getStockQuantity());
                })
                .collect(Collectors.toList());
    }

    // ── Underutilized ─────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<InventoryInsightDTO> getUnderutilizedInsights() {
        LocalDate cutoff = LocalDate.now().minusDays(UNDERUTILIZED_DAYS);
        return loanRepo.findUnderutilizedProducts(cutoff)
                .stream()
                .map(p -> new InventoryInsightDTO(
                        p.getId(), p.getTitle(), p.getType(),
                        InventoryInsightDTO.InsightType.CONSIDER_REMOVAL,
                        "No borrows in the last " + UNDERUTILIZED_DAYS + " days. Consider reviewing or removing.",
                        0L, p.getStockQuantity()))
                .collect(Collectors.toList());
    }

    // ── Full report ───────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public InventoryAnalyticsReport getFullReport() {
        InventoryAnalyticsReport report = new InventoryAnalyticsReport();
        report.setTopBorrowed(getTopBorrowedProducts(10));
        report.setLeastBorrowed(getLeastBorrowedProducts(10));
        report.setCurrentYearTrends(getBorrowTrends(Year.now().getValue()));
        report.setHighDemandInsights(getHighDemandInsights());
        report.setUnderutilizedInsights(getUnderutilizedInsights());
        report.setTotalActiveLoans(loanRepo.countByStatus(LoanStatus.ACTIVE));
        report.setTotalOverdueLoans(loanRepo.countByStatus(LoanStatus.OVERDUE));
        report.setTotalLoansAllTime(loanRepo.count());
        Double unpaidFines = loanRepo.sumAllUnpaidFines();
        report.setTotalUnpaidFines(unpaidFines != null ? unpaidFines : 0.0);
        return report;
    }
}
