package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CancelReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.RejectReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.entity.InstructorProfile;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.ReservationAuditLog;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.TeachingSession;
import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.exception.BookingPolicyViolationException;
import com.esprit.microservice.resourcemanagement.exception.ReservationConflictException;
import com.esprit.microservice.resourcemanagement.exception.ReservationNotFoundException;
import com.esprit.microservice.resourcemanagement.exception.ResourceUnderMaintenanceException;
import com.esprit.microservice.resourcemanagement.repository.ReservationAuditLogRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationAuditLogRepository auditLogRepository;
    private final ResourceService resourceService;
    private final TeachingSessionService teachingSessionService;
    private final InstructorProfileService profileService;
    private final MaintenanceWindowService maintenanceWindowService;
    private final KafkaEventPublisher kafkaEventPublisher;
    private final WaitlistService waitlistService;

    @Value("${app.reservation.default-expiry-hours:24}")
    private int defaultExpiryHours;

    @Value("${app.reservation.max-duration-hours:8}")
    private int maxDurationHours;

    @Value("${app.reservation.max-advance-booking-days:90}")
    private int maxAdvanceBookingDays;

    // ── queries ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ReservationResponse> listForInstructor(String instructorId) {
        return reservationRepository.findByInstructorIdAndDeletedFalse(instructorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> listAll() {
        return reservationRepository.findAll().stream()
                .filter(r -> !Boolean.TRUE.equals(r.getDeleted()))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getByRecurrenceGroup(UUID groupId) {
        return reservationRepository.findByRecurrenceGroupIdAndDeletedFalse(groupId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> listSwappable(String excludeInstructorId) {
        return reservationRepository.findSwappableReservations(excludeInstructorId, LocalDateTime.now()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getPending() {
        return reservationRepository.findByStatusAndDeletedFalse(ReservationStatus.PENDING).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── booking engine ────────────────────────────────────────────────────

    /**
     * Core booking flow as per spec §5.2.
     * Returns the saved reservation (PENDING or CONFIRMED).
     */
    public ReservationResponse create(CreateReservationRequest req, String instructorId) {
        LocalDateTime start = req.getStartTime();
        LocalDateTime end   = req.getEndTime();

        // ① Validate time range
        validateTimeRange(start, end, maxDurationHours);

        if (start.isAfter(LocalDateTime.now().plusDays(maxAdvanceBookingDays))) {
            throw new BookingPolicyViolationException(
                    "Cannot book more than " + maxAdvanceBookingDays + " days in advance");
        }

        // ② Load instructor profile
        InstructorProfile profile = profileService.getOrCreate(instructorId);

        // ③ Load and validate resource
        Resource resource = resourceService.findOrThrow(req.getResourceId());

        if (resource.getMaintenanceStatus() != MaintenanceStatus.OPERATIONAL) {
            throw new ResourceUnderMaintenanceException(
                    "Resource '" + resource.getName() + "' is not operational");
        }

        // ④ Check maintenance windows
        if (maintenanceWindowService.hasMaintenanceConflict(resource.getId(), start, end)) {
            throw new ResourceUnderMaintenanceException(
                    "Resource '" + resource.getName() + "' has a maintenance window in this slot");
        }

        // ⑤ Advance booking policy (skip if trusted)
        if (resource.getMinAdvanceBookingHours() != null && !Boolean.TRUE.equals(profile.getIsTrusted())) {
            long hoursUntilStart = ChronoUnit.HOURS.between(LocalDateTime.now(), start);
            if (hoursUntilStart < resource.getMinAdvanceBookingHours()) {
                throw new BookingPolicyViolationException(
                        "Booking requires at least " + resource.getMinAdvanceBookingHours()
                                + " hours advance notice");
            }
        }

        // ⑥ Conflict detection with pessimistic lock
        List<Reservation> conflicts = reservationRepository
                .findConflictingReservationsWithLock(resource.getId(), start, end);
        if (!conflicts.isEmpty()) {
            throw new ReservationConflictException(
                    "Resource '" + resource.getName() + "' is already booked for this time slot");
        }

        TeachingSession session = teachingSessionService.findOrThrow(req.getTeachingSessionId());

        // ⑦ Smart approval logic
        boolean forceApproval = profile.getReputationScore() < 50;
        boolean needsApproval = forceApproval || Boolean.TRUE.equals(resource.getRequiresApproval())
                && !profile.canAutoConfirmApprovalRequired();

        ReservationStatus status;
        String qrToken = null;
        LocalDateTime expiresAt = null;

        if (needsApproval) {
            status    = ReservationStatus.PENDING;
            expiresAt = LocalDateTime.now().plusHours(defaultExpiryHours);
        } else {
            status   = ReservationStatus.CONFIRMED;
            qrToken  = UUID.randomUUID().toString();
        }

        Reservation reservation = Reservation.builder()
                .resource(resource)
                .teachingSession(session)
                .instructorId(instructorId)
                .startTime(start)
                .endTime(end)
                .status(status)
                .qrCodeToken(qrToken)
                .expiresAt(expiresAt)
                .noShow(false)
                .deleted(false)
                .build();

        Reservation saved = reservationRepository.save(reservation);

        // ⑧ Audit log
        saveAuditLog(saved.getId(), "CREATED", null, status.name(), instructorId,
                Map.of("resourceId", resource.getId().toString(),
                       "sessionId", session.getId().toString()));

        // Kafka events
        profileService.incrementReservations(instructorId);

        if (status == ReservationStatus.PENDING) {
            kafkaEventPublisher.approvalNeeded(
                    saved.getId().toString(), resource.getId().toString(), instructorId);
        } else {
            kafkaEventPublisher.reservationConfirmed(
                    saved.getId().toString(), instructorId,
                    resource.getId().toString(), qrToken);
        }

        return toResponse(saved);
    }

    /** Admin: approve a PENDING reservation → CONFIRMED */
    public ReservationResponse approve(UUID id, String adminId) {
        Reservation reservation = findOrThrow(id);
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Reservation is not PENDING");
        }

        String qrToken = UUID.randomUUID().toString();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setQrCodeToken(qrToken);
        reservation.setExpiresAt(null);
        Reservation saved = reservationRepository.save(reservation);

        saveAuditLog(id, "CONFIRMED", "PENDING", "CONFIRMED", adminId, Map.of());

        kafkaEventPublisher.reservationConfirmed(
                id.toString(),
                reservation.getInstructorId(),
                reservation.getResource().getId().toString(),
                qrToken);

        return toResponse(saved);
    }

    /** Admin: reject a PENDING reservation */
    public ReservationResponse reject(UUID id, RejectReservationRequest req, String adminId) {
        Reservation reservation = findOrThrow(id);
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Reservation is not PENDING");
        }

        reservation.setStatus(ReservationStatus.REJECTED);
        reservation.setRejectionReason(req.getReason());
        Reservation saved = reservationRepository.save(reservation);

        saveAuditLog(id, "REJECTED", "PENDING", "REJECTED", adminId,
                Map.of("reason", req.getReason() != null ? req.getReason() : ""));

        kafkaEventPublisher.reservationRejected(id.toString(),
                reservation.getInstructorId(), req.getReason());

        return toResponse(saved);
    }

    /** Instructor or Admin: cancel a reservation */
    public ReservationResponse cancel(UUID id, CancelReservationRequest req, String actorId) {
        Reservation reservation = findOrThrow(id);

        if (reservation.getStatus() == ReservationStatus.CANCELLED
                || reservation.getStatus() == ReservationStatus.REJECTED) {
            throw new IllegalArgumentException("Reservation is already " + reservation.getStatus());
        }

        String oldStatus = reservation.getStatus().name();
        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancellationReason(req.getReason());
        Reservation saved = reservationRepository.save(reservation);

        // Apply reputation penalty for late cancellations
        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            long minutesBefore = ChronoUnit.MINUTES.between(
                    LocalDateTime.now(), reservation.getStartTime());
            if (minutesBefore < 1440) { // < 24 hours
                profileService.recordLateCancellation(reservation.getInstructorId(),
                        (int) minutesBefore);
            }
        }

        saveAuditLog(id, "CANCELLED", oldStatus, "CANCELLED", actorId,
                Map.of("reason", req.getReason() != null ? req.getReason() : ""));

        kafkaEventPublisher.reservationCancelled(id.toString(),
                reservation.getInstructorId(), req.getReason());

        // Notify waitlist
        waitlistService.processWaitlistAfterCancellation(
                reservation.getResource().getId(),
                reservation.getStartTime(),
                reservation.getEndTime());

        return toResponse(saved);
    }

    /** Admin: cancel all reservations in a recurrence group */
    public void cancelGroup(UUID groupId, String adminId) {
        List<Reservation> group = reservationRepository.findByRecurrenceGroupIdAndDeletedFalse(groupId);
        for (Reservation r : group) {
            if (r.getStatus() != ReservationStatus.CANCELLED
                    && r.getStatus() != ReservationStatus.REJECTED) {
                r.setStatus(ReservationStatus.CANCELLED);
                r.setCancellationReason("Group cancelled by admin");
                reservationRepository.save(r);
                saveAuditLog(r.getId(), "CANCELLED", r.getStatus().name(),
                        "CANCELLED", adminId, Map.of("groupId", groupId.toString()));
            }
        }
    }

    // ── helpers ───────────────────────────────────────────────────────────

    public static void validateTimeRange(LocalDateTime start, LocalDateTime end, int maxHours) {
        if (!end.isAfter(start)) {
            throw new com.esprit.microservice.resourcemanagement.exception.InvalidTimeRangeException(
                    "endTime must be after startTime");
        }
        long hours = ChronoUnit.HOURS.between(start, end);
        if (hours > maxHours) {
            throw new com.esprit.microservice.resourcemanagement.exception.InvalidTimeRangeException(
                    "Reservation duration cannot exceed " + maxHours + " hours");
        }
    }

    public Reservation findOrThrow(UUID id) {
        return reservationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ReservationNotFoundException("Reservation not found: " + id));
    }

    private void saveAuditLog(UUID reservationId, String action, String oldStatus,
                               String newStatus, String performedBy,
                               Map<String, String> details) {
        ReservationAuditLog log = ReservationAuditLog.builder()
                .reservationId(reservationId)
                .action(action)
                .oldStatus(oldStatus)
                .newStatus(newStatus)
                .performedBy(performedBy)
                .build();
        log.setDetails(details);
        auditLogRepository.save(log);
    }

    public ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .resourceId(r.getResource() != null ? r.getResource().getId() : null)
                .resourceName(r.getResource() != null ? r.getResource().getName() : null)
                .resourceLocation(r.getResource() != null ? r.getResource().getLocation() : null)
                .teachingSessionId(r.getTeachingSession() != null ? r.getTeachingSession().getId() : null)
                .sessionTitle(r.getTeachingSession() != null ? r.getTeachingSession().getTitle() : null)
                .courseCode(r.getTeachingSession() != null ? r.getTeachingSession().getCourseCode() : null)
                .instructorId(r.getInstructorId())
                .startTime(r.getStartTime())
                .endTime(r.getEndTime())
                .status(r.getStatus())
                .recurrenceGroupId(r.getRecurrenceGroupId())
                .qrCodeToken(r.getQrCodeToken())
                .checkedInAt(r.getCheckedInAt())
                .noShow(r.getNoShow())
                .rejectionReason(r.getRejectionReason())
                .cancellationReason(r.getCancellationReason())
                .expiresAt(r.getExpiresAt())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
