package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityCheckResponse {
    private boolean available;
    private List<ResourceResponse> availableResources;
    private List<ReservationResponse> conflictingReservations;
}
