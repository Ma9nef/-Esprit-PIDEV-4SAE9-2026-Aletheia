package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.response.ResourceStatisticsResponse;
import com.esprit.microservice.resourcemanagement.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/resources/{id}")
    public ResponseEntity<ResourceStatisticsResponse> resourceStats(
            @PathVariable UUID id,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        if (from == null) from = LocalDateTime.now().minusDays(30);
        if (to   == null) to   = LocalDateTime.now();

        return ResponseEntity.ok(statisticsService.resourceStats(id, from, to));
    }

    @GetMapping("/platform")
    public ResponseEntity<Map<String, Object>> platform() {
        return ResponseEntity.ok(statisticsService.platformStats());
    }

    @GetMapping("/instructors")
    public ResponseEntity<Map<String, Object>> instructors() {
        // Re-use platform stats — top instructors included
        return ResponseEntity.ok(statisticsService.platformStats());
    }

    @GetMapping("/underutilized")
    public ResponseEntity<Map<String, Object>> underutilized() {
        Map<String, Object> stats = statisticsService.platformStats();
        return ResponseEntity.ok(Map.of(
                "underutilizedResourceIds", stats.get("underutilizedResourceIds")
        ));
    }
}
