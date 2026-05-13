package com.esprit.microservice.resourcemanagement.dto.request;

import lombok.Data;

@Data
public class CancelReservationRequest {
    private String reason;
}
