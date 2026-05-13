package com.esprit.microservice.library.dto;

import lombok.Data;

import java.util.List;

@Data
public class InventoryAnalyticsReport {
    private List<TopProductDTO> topBorrowed;
    private List<TopProductDTO> leastBorrowed;
    private List<BorrowTrendDTO> currentYearTrends;
    private List<InventoryInsightDTO> highDemandInsights;
    private List<InventoryInsightDTO> underutilizedInsights;
    private long totalActiveLoans;
    private long totalOverdueLoans;
    private long totalLoansAllTime;
    private double totalUnpaidFines;
}
