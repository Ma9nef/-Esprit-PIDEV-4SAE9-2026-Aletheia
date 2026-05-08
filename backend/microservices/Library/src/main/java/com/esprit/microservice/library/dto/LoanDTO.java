package com.esprit.microservice.library.dto;

import com.esprit.microservice.library.enums.LoanStatus;
import com.esprit.microservice.library.enums.ProductType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class LoanDTO {
    private Long id;
    private Long userId;
    private String userRole;
    private Long productId;
    private String productTitle;
    private String productAuthor;
    private ProductType productType;
    private String productCoverImageUrl;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private LoanStatus status;
    private double fineAmount;
    private boolean finePaid;
    /** Positive value means the item is overdue by that many days. */
    private long daysOverdue;
    private LocalDateTime createdAt;
}
