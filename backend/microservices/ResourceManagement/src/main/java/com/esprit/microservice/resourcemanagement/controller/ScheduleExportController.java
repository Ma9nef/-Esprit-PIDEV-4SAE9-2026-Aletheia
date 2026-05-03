package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.service.ScheduleExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ScheduleExportController {

    private final ScheduleExportService scheduleExportService;

    /**
     * GET /api/export/pdf?from=2026-04-01&to=2026-04-30
     * Returns instructor's own schedule as PDF.
     */
    @GetMapping("/pdf")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<byte[]> exportPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        if (from == null) from = LocalDate.now().withDayOfMonth(1);
        if (to   == null) to   = LocalDate.now().plusMonths(1).withDayOfMonth(1).minusDays(1);

        String instructorId = SecurityContextHolder.getContext().getAuthentication().getName();
        byte[] pdf = scheduleExportService.exportPdf(instructorId, from, to);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("schedule-" + from + "-" + to + ".pdf").build());

        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    /**
     * GET /api/export/ical/{instructorId}
     * Public endpoint — no auth required — for calendar subscription.
     */
    @GetMapping("/ical/{instructorId}")
    public ResponseEntity<byte[]> exportIcal(@PathVariable String instructorId) {
        byte[] ics = scheduleExportService.exportIcal(instructorId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/calendar"));
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("schedule-" + instructorId + ".ics").build());

        return ResponseEntity.ok().headers(headers).body(ics);
    }
}
