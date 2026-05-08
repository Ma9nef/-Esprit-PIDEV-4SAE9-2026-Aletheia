package com.esprit.microservice.resourcemanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RejectReservationRequest {

    @NotBlank
    private String reason;
}
