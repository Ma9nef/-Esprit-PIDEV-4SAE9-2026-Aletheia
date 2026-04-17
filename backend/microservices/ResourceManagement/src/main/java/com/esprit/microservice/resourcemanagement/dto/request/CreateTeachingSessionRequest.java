package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.entity.enums.SessionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTeachingSessionRequest {

    @NotBlank
    private String title;

    private String courseCode;

    private String module;

    @Min(1)
    private Integer expectedAttendees;

    @NotNull
    private SessionType sessionType;
}
