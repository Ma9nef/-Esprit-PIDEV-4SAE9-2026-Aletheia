package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data @Builder
public class RecurrenceBookingResult {
    private UUID groupId;
    private List<ReservationResponse> bookedSlots;
    private List<SkippedSlot> skippedSlots;
    private int totalAttempted;
    private int totalBooked;

    @Data @Builder
    public static class SkippedSlot {
        private LocalDate date;
        private String reason;
    }
}
