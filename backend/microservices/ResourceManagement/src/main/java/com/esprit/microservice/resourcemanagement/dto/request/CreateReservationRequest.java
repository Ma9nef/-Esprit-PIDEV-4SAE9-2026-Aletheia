package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.config.FlexibleUuidDeserializer;
import tools.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CreateReservationRequest {

    @NotNull
    @JsonDeserialize(using = FlexibleUuidDeserializer.class)
    private UUID resourceId;

    @NotNull
    @JsonDeserialize(using = FlexibleUuidDeserializer.class)
    private UUID teachingSessionId;

    @NotNull
    @Future
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    private String notes;
}
