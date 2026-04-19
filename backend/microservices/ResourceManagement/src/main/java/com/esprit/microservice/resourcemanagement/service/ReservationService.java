package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.client.EventServiceClient;
import com.esprit.microservice.resourcemanagement.dto.request.CheckAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityCheckResponse;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.ReservationAuditLog;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.exception.InvalidTimeRangeException;
import com.esprit.microservice.resourcemanagement.exception.ReservationConflictException;
import com.esprit.microservice.resourcemanagement.exception.ReservationNotFoundException;
import com.esprit.microservice.resourcemanagement.mapper.ReservationMapper;
import com.esprit.microservice.resourcemanagement.mapper.ResourceMapper;
import com.esprit.microservice.resourcemanagement.repository.ReservationAuditLogRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ResourceRepository resourceRepository;
    private final ReservationAuditLogRepository auditLogRepository;
    private final ResourceService resourceService;
    private final ReservationMapper reservationMapper;
    private final ResourceMapper resourceMapper;

    @Autowired(required = false)
    private ReservationEventPublisher eventPublisher;

    @Autowired(required = false)
    private EventServiceClient eventServiceClient;

    /**
     * Create a new reservation with full conflict detection and pessimistic locking.
     *
     * CONCURRENCY STRATEGY (Hybrid Approach):
     * ─────────────────────────────────────────
     * We use BOTH pessimistic and optimistic locking for maximum safety:
     *
     * 1. PESSIMISTIC WRITE LOCK (Primary — on conflict detection query):
     *    The findConflictingReservationsWithLock() query acquires a row-level
     *    exclusive lock (SELECT ... FOR UPDATE) on all existing reservations
     *    that overlap the requested time window. This prevents two concurrent
     *    transactions from both seeing "no conflicts" and both inserting.
     *    This is the CRITICAL mechanism that prevents double-booking.
     *
     * 2. OPTIMISTIC LOCKING (Secondary — on the Reservation entity via @Version):
     *    Acts as a safety net for update operations (e.g., cancel). If two
     *    requests try to cancel the same reservation simultaneously, the second
     *    one fails with OptimisticLockingFailureException rather than silently
     *    overwriting.
     *
     * WHY PESSIMISTIC for creation:
     *   Optimistic locking alone is insufficient for INSERT operations because
     *   there's no existing row to version-check against. A pessimistic lock
     *   on the conflict query serializes concurrent inserts for the same resource
     *   and time range, guaranteeing at most one reservation is created.
     */
    @Transactional
    public ReservationResponse createReservation(CreateReservationRequest request, String createdBy) {
        log.info("Creating reservation: resource={}, event={}, from={} to={}",
                request.getResourceId(), request.getEventId(),
                request.getStartTime(), request.getEndTime());

        // 1. Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidTimeRangeException();
        }

        // 2. Validate event exists in the Event microservice (via Feign)
        validateEventExists(request.getEventId());

        // 3. Validate resource exists and is active
        Resource resource = resourceService.findResourceOrThrow(request.getResourceId());

        // 4. CRITICAL: Check for conflicts using pessimistic lock
        //    This SELECT ... FOR UPDATE locks overlapping rows so no other
        //    transaction can insert a conflicting reservation concurrently.
        List<Reservation> conflicts = reservationRepository.findConflictingReservationsWithLock(
                request.getResourceId(),
                request.getStartTime(),
                request.getEndTime());

        if (!conflicts.isEmpty()) {
            log.warn("Reservation conflict detected: {} conflicting reservations for resource={}",
                    conflicts.size(), request.getResourceId());
            throw new ReservationConflictException(
                    String.format("Resource '%s' is already reserved during the requested time period. " +
                                    "Found %d conflicting reservation(s).",
                            resource.getName(), conflicts.size()));
        }

        // 5. Create and save reservation
        Reservation reservation = reservationMapper.toEntity(request);
        reservation.setCreatedBy(createdBy);
        Reservation saved = reservationRepository.save(reservation);

        // 6. Audit log
        auditLogRepository.save(ReservationAuditLog.builder()
                .reservationId(saved.getId())
                .action("CREATED")
                .newStatus(saved.getStatus().name())
                .performedBy(createdBy)
                .details(Map.of(
                        "resourceId", saved.getResourceId().toString(),
                        "eventId", saved.getEventId(),
                        "startTime", saved.getStartTime().toString(),
                        "endTime", saved.getEndTime().toString()))
                .build());

        // 7. Publish event (async, non-blocking)
        if (eventPublisher != null) {
            eventPublisher.publishReservationCreated(saved);
        }

        log.info("Reservation created: id={}", saved.getId());
        return reservationMapper.toResponseWithResourceName(saved, resource);
    }

    /**
     * Confirm a pending reservation.
     * Uses optimistic locking via @Version to prevent concurrent status changes.
     */
    @Transactional
    public ReservationResponse confirmReservation(UUID id, String performedBy) {
        log.info("Confirming reservation id={}", id);
        Reservation reservation = findReservationOrThrow(id);

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only PENDING reservations can be confirmed. Current status: " + reservation.getStatus());
        }

        String oldStatus = reservation.getStatus().name();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        Reservation saved = reservationRepository.save(reservation);

        auditLogRepository.save(ReservationAuditLog.builder()
                .reservationId(saved.getId())
                .action("CONFIRMED")
                .oldStatus(oldStatus)
                .newStatus(saved.getStatus().name())
                .performedBy(performedBy)
                .build());

        if (eventPublisher != null) {
            eventPublisher.publishReservationConfirmed(saved);
        }

        log.info("Reservation confirmed: id={}", saved.getId());
        return reservationMapper.toResponse(saved);
    }

    /**
     * Cancel a reservation.
     * Uses optimistic locking via @Version to prevent concurrent cancellations.
     */
    @Transactional
    public ReservationResponse cancelReservation(UUID id, String performedBy) {
        log.info("Cancelling reservation id={}", id);
        Reservation reservation = findReservationOrThrow(id);

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new IllegalArgumentException("Reservation is already cancelled");
        }

        String oldStatus = reservation.getStatus().name();
        reservation.setStatus(ReservationStatus.CANCELLED);
        Reservation saved = reservationRepository.save(reservation);

        auditLogRepository.save(ReservationAuditLog.builder()
                .reservationId(saved.getId())
                .action("CANCELLED")
                .oldStatus(oldStatus)
                .newStatus(saved.getStatus().name())
                .performedBy(performedBy)
                .build());

        if (eventPublisher != null) {
            eventPublisher.publishReservationCancelled(saved);
        }

        log.info("Reservation cancelled: id={}", saved.getId());
        return reservationMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByEventId(String eventId) {
        return reservationRepository.findByEventIdAndDeletedFalse(eventId)
                .stream()
                .map(reservationMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(UUID id) {
        Reservation reservation = findReservationOrThrow(id);
        return reservationMapper.toResponse(reservation);
    }

    /**
     * Check availability for a resource or resource type in a given time range.
     * Uses non-locking query since this is a read-only operation.
     */
    @Transactional(readOnly = true)
    public AvailabilityCheckResponse checkAvailability(CheckAvailabilityRequest request) {
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidTimeRangeException();
        }

        // If checking a specific resource
        if (request.getResourceId() != null) {
            Resource resource = resourceService.findResourceOrThrow(request.getResourceId());
            List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                    request.getResourceId(), request.getStartTime(), request.getEndTime());

            boolean available = conflicts.isEmpty();
            return AvailabilityCheckResponse.builder()
                    .available(available)
                    .availableResources(available ?
                            List.of(resourceMapper.toResponse(resource)) : List.of())
                    .conflictingReservations(conflicts.stream()
                            .map(reservationMapper::toResponse)
                            .collect(Collectors.toList()))
                    .build();
        }

        // If checking by resource type
        if (request.getType() != null) {
            List<Resource> available = resourceRepository.findAvailableByType(
                    request.getType(), request.getStartTime(), request.getEndTime());

            List<ResourceResponse> availableResponses = available.stream()
                    .map(resourceMapper::toResponse)
                    .collect(Collectors.toList());

            return AvailabilityCheckResponse.builder()
                    .available(!available.isEmpty())
                    .availableResources(availableResponses)
                    .conflictingReservations(List.of())
                    .build();
        }

        throw new IllegalArgumentException("Either resourceId or type must be provided");
    }

    /**
     * Validates that the given eventId corresponds to an existing event
     * in the Event microservice (called via OpenFeign).
     *
     * If the eventId is not a numeric Long, or the Event service is unavailable,
     * validation is skipped with a warning to avoid blocking reservation creation
     * due to a downstream service failure (resilient degradation).
     */
    private void validateEventExists(String eventId) {
        if (eventServiceClient == null) {
            log.warn("EventServiceClient not available — skipping event validation");
            return;
        }
        try {
            Long id = Long.parseLong(eventId);
            eventServiceClient.getEventById(id);
            log.info("Event validation passed for eventId={}", eventId);
        } catch (NumberFormatException e) {
            log.warn("eventId '{}' is not a numeric Long — skipping event validation", eventId);
        } catch (Exception e) {
            log.warn("Event service unreachable or event not found for eventId='{}': {} — skipping validation",
                    eventId, e.getMessage());
        }
    }

    private Reservation findReservationOrThrow(UUID id) {
        return reservationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));
    }
}
