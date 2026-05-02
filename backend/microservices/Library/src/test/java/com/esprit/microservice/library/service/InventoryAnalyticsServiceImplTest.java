package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.LoanStatus;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryAnalyticsServiceImplTest {

    @Mock
    private LoanRepository loanRepo;

    @InjectMocks
    private InventoryAnalyticsServiceImpl service;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        ReflectionTestUtils.setField(product, "id", 8L);
        product.setTitle("Algorithms");
        product.setAuthor("Sedgewick");
        product.setType(ProductType.BOOK);
        product.setStockQuantity(5);
    }

    @Test
    void getTopBorrowedProducts_shouldMapRepositoryRows() {
        when(loanRepo.findTopBorrowedProducts(any()))
                .thenReturn(Collections.singletonList(new Object[]{product, 12L}));

        var top = service.getTopBorrowedProducts(10);

        assertEquals(1, top.size());
        assertEquals(8L, top.get(0).getProductId());
        assertEquals(12L, top.get(0).getBorrowCount());
    }

    @Test
    void getFullReport_shouldDefaultNullUnpaidFinesToZero() {
        when(loanRepo.findTopBorrowedProducts(any())).thenReturn(Collections.emptyList());
        when(loanRepo.findAllProductsWithBorrowCount(any())).thenReturn(Collections.emptyList());
        when(loanRepo.findBorrowTrendsByYear(anyInt())).thenReturn(Collections.emptyList());
        when(loanRepo.findHighDemandProducts()).thenReturn(Collections.emptyList());
        when(loanRepo.findUnderutilizedProducts(any())).thenReturn(List.of());
        when(loanRepo.countByStatus(LoanStatus.ACTIVE)).thenReturn(3L);
        when(loanRepo.countByStatus(LoanStatus.OVERDUE)).thenReturn(1L);
        when(loanRepo.count()).thenReturn(20L);
        when(loanRepo.sumAllUnpaidFines()).thenReturn(null);

        var report = service.getFullReport();

        assertEquals(3L, report.getTotalActiveLoans());
        assertEquals(1L, report.getTotalOverdueLoans());
        assertEquals(20L, report.getTotalLoansAllTime());
        assertEquals(0.0, report.getTotalUnpaidFines());
    }
}

