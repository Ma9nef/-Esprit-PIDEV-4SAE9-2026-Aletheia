package com.esprit.microservice.resourcemanagement.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdjustScoreRequest {

    @NotNull
    @Min(-100) @Max(100)
    private Integer delta;

    @NotBlank
    private String reason;
}
