package com.esprit.microservice.library.dto;

import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.enums.UserRole;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Set;

@Data
public class BorrowingPolicyDTO {
    private Long id;

    @NotNull
    private UserRole userRole;

    @Min(1)
    private int maxActiveBorrows;

    @Min(1)
    private int loanDurationDays;

    @Min(0)
    private double fineRatePerDay;

    @Min(0)
    private double maxFineBlockThreshold;

    private Set<ProductType> restrictedProductTypes;
}
