package com.esprit.microservice.resourcemanagement.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateSwapRequest {

    @NotNull
    private UUID requesterReservationId;

    @NotNull
    private UUID targetReservationId;

    private String note;
}
