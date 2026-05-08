package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentRequestDTO {
    private String comment;
    private Long eventId;
    private Long userId;
    private String userEmail;
}