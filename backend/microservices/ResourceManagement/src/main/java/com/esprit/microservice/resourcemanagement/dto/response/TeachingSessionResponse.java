package com.esprit.microservice.resourcemanagement.dto.response;

import com.esprit.microservice.resourcemanagement.entity.enums.SessionType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class TeachingSessionResponse {
    private UUID id;
    private String title;
    private String courseCode;
    private String instructorId;
    private String module;
    private Integer expectedAttendees;
    private SessionType sessionType;
    private LocalDateTime createdAt;
}
