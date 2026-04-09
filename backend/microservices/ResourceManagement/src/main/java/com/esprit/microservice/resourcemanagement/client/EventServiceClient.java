package com.esprit.microservice.resourcemanagement.client;

import com.esprit.microservice.resourcemanagement.dto.response.EventSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for the Event microservice.
 * Used to validate that an event exists before creating a reservation.
 */
@FeignClient(name = "EVENT-MICROSERVICE", path = "/api/events")
public interface EventServiceClient {

    @GetMapping("/{id}")
    EventSummaryDto getEventById(@PathVariable("id") Long id);
}
