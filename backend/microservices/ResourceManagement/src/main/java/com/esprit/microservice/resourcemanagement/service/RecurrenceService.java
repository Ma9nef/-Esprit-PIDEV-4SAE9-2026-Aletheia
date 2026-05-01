package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateRecurrenceReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.RecurrenceBookingResult;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.entity.RecurrenceGroup;
import com.esprit.microservice.resourcemanagement.entity.enums.RecurrencePattern;
import com.esprit.microservice.resourcemanagement.repository.RecurrenceGroupRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RecurrenceService {

    private final RecurrenceGroupRepository recurrenceGroupRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;

    public RecurrenceBookingResult createRecurring(
            CreateRecurrenceReservationRequest req, String instructorId) {

        // Build recurrence group
        RecurrenceGroup group = RecurrenceGroup.builder()
                .pattern(req.getPattern())
                .dayOfWeek(req.getDayOfWeek())
                .slotStartTime(req.getSlotStartTime())
                .slotEndTime(req.getSlotEndTime())
                .endDate(req.getEndDate())
                .createdBy(instructorId)
                .totalSlots(0)
                .bookedSlots(0)
                .build();
        group = recurrenceGroupRepository.save(group);

        UUID groupId = group.getId();
        List<LocalDate> occurrences = computeOccurrences(req.getPattern(),
                req.getDayOfWeek(), req.getEndDate());

        List<ReservationResponse> bookedSlots  = new ArrayList<>();
        List<RecurrenceBookingResult.SkippedSlot> skippedSlots = new ArrayList<>();

        for (LocalDate date : occurrences) {
            LocalDateTime start = date.atTime(req.getSlotStartTime());
            LocalDateTime end   = date.atTime(req.getSlotEndTime());

            CreateReservationRequest singleReq = new CreateReservationRequest();
            singleReq.setResourceId(req.getResourceId());
            singleReq.setTeachingSessionId(req.getTeachingSessionId());
            singleReq.setStartTime(start);
            singleReq.setEndTime(end);

            try {
                ReservationResponse res = reservationService.create(singleReq, instructorId);
                // Tag with recurrence group
                reservationRepository.findByIdAndDeletedFalse(res.getId()).ifPresent(r -> {
                    r.setRecurrenceGroupId(groupId);
                    reservationRepository.save(r);
                });
                // Return updated response with groupId
                bookedSlots.add(ReservationResponse.builder()
                        .id(res.getId())
                        .resourceId(res.getResourceId())
                        .resourceName(res.getResourceName())
                        .instructorId(res.getInstructorId())
                        .startTime(res.getStartTime())
                        .endTime(res.getEndTime())
                        .status(res.getStatus())
                        .recurrenceGroupId(groupId)
                        .qrCodeToken(res.getQrCodeToken())
                        .expiresAt(res.getExpiresAt())
                        .createdAt(res.getCreatedAt())
                        .build());
            } catch (Exception e) {
                log.debug("Skipping occurrence on {}: {}", date, e.getMessage());
                skippedSlots.add(RecurrenceBookingResult.SkippedSlot.builder()
                        .date(date)
                        .reason(e.getMessage())
                        .build());
            }
        }

        // Update counters
        group.setTotalSlots(occurrences.size());
        group.setBookedSlots(bookedSlots.size());
        recurrenceGroupRepository.save(group);

        return RecurrenceBookingResult.builder()
                .groupId(groupId)
                .bookedSlots(bookedSlots)
                .skippedSlots(skippedSlots)
                .totalAttempted(occurrences.size())
                .totalBooked(bookedSlots.size())
                .build();
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private List<LocalDate> computeOccurrences(RecurrencePattern pattern,
                                                DayOfWeek dayOfWeek, LocalDate endDate) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate today   = LocalDate.now();

        // Find first occurrence on or after tomorrow
        LocalDate cursor = today.plusDays(1)
                .with(TemporalAdjusters.nextOrSame(dayOfWeek));

        int stepWeeks = (pattern == RecurrencePattern.BIWEEKLY) ? 2 : 1;

        while (!cursor.isAfter(endDate)) {
            dates.add(cursor);
            cursor = cursor.plusWeeks(stepWeeks);
        }
        return dates;
    }
}
