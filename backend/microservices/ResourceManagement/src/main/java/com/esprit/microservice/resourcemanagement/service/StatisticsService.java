package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.response.ResourceStatisticsResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceService resourceService;

    public ResourceStatisticsResponse resourceStats(UUID resourceId,
                                                    LocalDateTime from, LocalDateTime to) {
        var resource = resourceService.findOrThrow(resourceId);

        List<Reservation> reservations = reservationRepository.findAll().stream()
                .filter(r -> !Boolean.TRUE.equals(r.getDeleted()))
                .filter(r -> r.getResource() != null && resourceId.equals(r.getResource().getId()))
                .filter(r -> !r.getStartTime().isBefore(from) && !r.getEndTime().isAfter(to))
                .collect(Collectors.toList());

        long total     = reservations.size();
        long confirmed = count(reservations, ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN, ReservationStatus.COMPLETED);
        long cancelled = count(reservations, ReservationStatus.CANCELLED);
        long pending   = count(reservations, ReservationStatus.PENDING);

        Long confirmedHours = reservationRepository.totalConfirmedHours(resourceId, from, to);
        long totalHours = confirmedHours != null ? confirmedHours : 0L;

        long periodHours = ChronoUnit.HOURS.between(from, to);
        double utilization = periodHours > 0
                ? Math.min(100.0, (double) totalHours / periodHours * 100.0)
                : 0.0;

        double avgDuration = confirmed > 0 ? (double) totalHours / confirmed : 0.0;

        // Peak hours (hour-of-day → count)
        Map<String, Long> peakHours = reservations.stream()
                .filter(r -> r.getStatus() != ReservationStatus.CANCELLED
                        && r.getStatus() != ReservationStatus.REJECTED)
                .collect(Collectors.groupingBy(
                        r -> String.format("%02d:00", r.getStartTime().getHour()),
                        Collectors.counting()));

        // Reservations by day of week
        Map<String, Long> byDayOfWeek = reservations.stream()
                .filter(r -> r.getStatus() != ReservationStatus.CANCELLED
                        && r.getStatus() != ReservationStatus.REJECTED)
                .collect(Collectors.groupingBy(
                        r -> r.getStartTime().getDayOfWeek().name(),
                        Collectors.counting()));

        return ResourceStatisticsResponse.builder()
                .resourceId(resourceId)
                .resourceName(resource.getName())
                .totalReservations(total)
                .confirmedReservations(confirmed)
                .cancelledReservations(cancelled)
                .pendingReservations(pending)
                .utilizationPercentage(Math.round(utilization * 100.0) / 100.0)
                .averageReservationDurationHours(Math.round(avgDuration * 100.0) / 100.0)
                .totalReservationHours(totalHours)
                .peakHours(peakHours)
                .reservationsByDayOfWeek(byDayOfWeek)
                .periodStart(from)
                .periodEnd(to)
                .build();
    }

    /** Platform-wide overview: top resources, active instructors, underutilized. */
    public Map<String, Object> platformStats() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> recent = reservationRepository.findAll().stream()
                .filter(r -> !Boolean.TRUE.equals(r.getDeleted()))
                .filter(r -> !r.getStartTime().isBefore(thirtyDaysAgo))
                .collect(Collectors.toList());

        // Most booked resources (top 10)
        Map<String, Long> byResource = recent.stream()
                .filter(r -> r.getResource() != null)
                .collect(Collectors.groupingBy(
                        r -> r.getResource().getId().toString(),
                        Collectors.counting()));

        List<Map<String, Object>> topResources = byResource.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> Map.<String, Object>of("resourceId", e.getKey(), "count", e.getValue()))
                .collect(Collectors.toList());

        // Most active instructors
        Map<String, Long> byInstructor = recent.stream()
                .collect(Collectors.groupingBy(Reservation::getInstructorId, Collectors.counting()));

        List<Map<String, Object>> topInstructors = byInstructor.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> Map.<String, Object>of("instructorId", e.getKey(), "count", e.getValue()))
                .collect(Collectors.toList());

        // Underutilized resources (< 20% in last 30 days)
        long periodHours = ChronoUnit.HOURS.between(thirtyDaysAgo, now);
        List<String> underutilized = resourceRepository.findByDeletedFalse().stream()
                .filter(r -> {
                    Long rHours = reservationRepository.totalConfirmedHours(r.getId(), thirtyDaysAgo, now);
                    double util = periodHours > 0 ? ((rHours != null ? rHours : 0L) * 100.0 / periodHours) : 0;
                    return util < 20.0;
                })
                .map(r -> r.getId().toString())
                .collect(Collectors.toList());

        return Map.of(
                "topResources", topResources,
                "topInstructors", topInstructors,
                "underutilizedResourceIds", underutilized,
                "totalReservationsLast30Days", (long) recent.size(),
                "periodStart", thirtyDaysAgo.toString(),
                "periodEnd", now.toString()
        );
    }

    // ── helper ────────────────────────────────────────────────────────────

    private long count(List<Reservation> list, ReservationStatus... statuses) {
        Set<ReservationStatus> set = Set.of(statuses);
        return list.stream().filter(r -> set.contains(r.getStatus())).count();
    }
}
