package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedEventDTO {
    private Long eventId;
    private Double score;
    private String title;
    private String category;
    private String location;
    private LocalDateTime startDate;
}