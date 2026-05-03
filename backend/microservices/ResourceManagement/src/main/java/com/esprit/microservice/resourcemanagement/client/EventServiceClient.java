package com.esprit.microservice.resourcemanagement.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

/**
 * Feign client for the Event microservice.
 * Kept as a placeholder; no longer used in the redesigned reservation flow
 * (TeachingSession replaces EventId coupling).
 */
@FeignClient(name = "EVENT-MICROSERVICE", path = "/api/events")
public interface EventServiceClient {

    @GetMapping("/{id}")
    Map<String, Object> getEventById(@PathVariable("id") Long id);
}
