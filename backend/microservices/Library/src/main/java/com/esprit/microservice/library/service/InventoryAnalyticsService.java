package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.BorrowTrendDTO;
import com.esprit.microservice.library.dto.InventoryAnalyticsReport;
import com.esprit.microservice.library.dto.InventoryInsightDTO;
import com.esprit.microservice.library.dto.TopProductDTO;

import java.util.List;

public interface InventoryAnalyticsService {

    /** Top N most-borrowed products of all time. */
    List<TopProductDTO> getTopBorrowedProducts(int limit);

    /** Bottom N least-borrowed products (including those never borrowed). */
    List<TopProductDTO> getLeastBorrowedProducts(int limit);

    /** Monthly borrow counts for the given calendar year. */
    List<BorrowTrendDTO> getBorrowTrends(int year);

    /**
     * Products currently at 0 stock that still have active/overdue loans —
     * flagged for copy increase.
     */
    List<InventoryInsightDTO> getHighDemandInsights();

    /**
     * Products with zero borrows in the last 90 days —
     * flagged for review or removal.
     */
    List<InventoryInsightDTO> getUnderutilizedInsights();

    /** Aggregated dashboard report (all of the above + summary totals). */
    InventoryAnalyticsReport getFullReport();
}
