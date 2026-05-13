package com.esprit.microservice.library.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payload sent to the Notification microservice's internal endpoint.
 * Fields are annotated with @JsonProperty to match the Python service's snake_case schema.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @JsonProperty("recipient_id")
    private Long recipientId;

    @JsonProperty("recipient_role")
    private String recipientRole;

    @JsonProperty("type")
    private String type;

    @JsonProperty("title")
    private String title;

    @JsonProperty("message")
    private String message;
}
