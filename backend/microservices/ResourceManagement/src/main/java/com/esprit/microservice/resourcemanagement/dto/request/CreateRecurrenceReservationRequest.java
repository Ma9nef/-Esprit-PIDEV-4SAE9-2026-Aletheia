package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.config.FlexibleUuidDeserializer;
import tools.jackson.databind.annotation.JsonDeserialize;
import com.esprit.microservice.resourcemanagement.entity.enums.RecurrencePattern;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Data
public class CreateRecurrenceReservationRequest {

    @NotNull
    @JsonDeserialize(using = FlexibleUuidDeserializer.class)
    private UUID resourceId;

    @NotNull
    @JsonDeserialize(using = FlexibleUuidDeserializer.class)
    private UUID teachingSessionId;

    @NotNull
    private RecurrencePattern pattern;

    @NotNull
    private DayOfWeek dayOfWeek;

    @NotNull
    private LocalTime slotStartTime;

    @NotNull
    private LocalTime slotEndTime;

    @NotNull
    @Future
    private LocalDate endDate;
}
