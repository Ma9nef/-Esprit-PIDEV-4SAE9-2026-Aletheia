package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateSwapRequest;
import com.esprit.microservice.resourcemanagement.dto.response.SwapRequestResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.SwapRequest;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.SwapRequestStatus;
import com.esprit.microservice.resourcemanagement.exception.ReservationNotFoundException;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.SwapRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final ReservationRepository reservationRepository;
    private final KafkaEventPublisher kafkaEventPublisher;

    @Transactional(readOnly = true)
    public List<SwapRequestResponse> listOwn(String instructorId) {
        return swapRequestRepository.findByInstructorId(instructorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Instructor A initiates a swap: A offers their reservation, wants B's.
     */
    public SwapRequestResponse requestSwap(CreateSwapRequest req, String requesterId) {
        Reservation targetReservation = reservationRepository
                .findByIdAndDeletedFalse(req.getTargetReservationId())
                .orElseThrow(() -> new ReservationNotFoundException(
                        "Target reservation not found: " + req.getTargetReservationId()));

        if (targetReservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalArgumentException("Target reservation is not CONFIRMED");
        }

        SwapRequest swap = SwapRequest.builder()
                .requesterId(requesterId)
                .targetId(targetReservation.getInstructorId())
                .requesterReservationId(null) // requester must specify their own reservation via a separate lookup
                .targetReservationId(req.getTargetReservationId())
                .status(SwapRequestStatus.PENDING)
                .requesterNote(req.getNote())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        SwapRequest saved = swapRequestRepository.save(swap);

        kafkaEventPublisher.swapRequested(
                saved.getId().toString(), requesterId, targetReservation.getInstructorId());

        return toResponse(saved);
    }

    /**
     * Instructor B accepts: atomically swap startTime/endTime and regenerate QR tokens.
     */
    public SwapRequestResponse acceptSwap(UUID swapId, String targetId) {
        SwapRequest swap = findOrThrow(swapId);

        if (swap.getStatus() != SwapRequestStatus.PENDING) {
            throw new IllegalArgumentException("Swap request is not PENDING");
        }
        if (!swap.getTargetId().equals(targetId)) {
            throw new IllegalArgumentException("Not authorized to accept this swap");
        }
        if (swap.isExpired()) {
            throw new IllegalArgumentException("Swap request has expired");
        }

        if (swap.getRequesterReservationId() == null) {
            throw new IllegalStateException("No requester reservation linked to this swap");
        }

        Reservation requesterRes = reservationRepository
                .findByIdAndDeletedFalse(swap.getRequesterReservationId())
                .orElseThrow(() -> new ReservationNotFoundException("Requester reservation not found"));
        Reservation targetRes = reservationRepository
                .findByIdAndDeletedFalse(swap.getTargetReservationId())
                .orElseThrow(() -> new ReservationNotFoundException("Target reservation not found"));

        // Atomic swap of time slots
        LocalDateTime tempStart = requesterRes.getStartTime();
        LocalDateTime tempEnd   = requesterRes.getEndTime();

        requesterRes.setStartTime(targetRes.getStartTime());
        requesterRes.setEndTime(targetRes.getEndTime());
        requesterRes.setQrCodeToken(UUID.randomUUID().toString());

        targetRes.setStartTime(tempStart);
        targetRes.setEndTime(tempEnd);
        targetRes.setQrCodeToken(UUID.randomUUID().toString());

        reservationRepository.save(requesterRes);
        reservationRepository.save(targetRes);

        swap.setStatus(SwapRequestStatus.ACCEPTED);
        swap.setResolvedAt(LocalDateTime.now());
        SwapRequest saved = swapRequestRepository.save(swap);

        kafkaEventPublisher.swapResolved(swapId.toString(), "ACCEPTED",
                swap.getRequesterId(), targetId);

        return toResponse(saved);
    }

    public SwapRequestResponse rejectSwap(UUID swapId, String note, String targetId) {
        SwapRequest swap = findOrThrow(swapId);

        if (swap.getStatus() != SwapRequestStatus.PENDING) {
            throw new IllegalArgumentException("Swap request is not PENDING");
        }
        if (!swap.getTargetId().equals(targetId)) {
            throw new IllegalArgumentException("Not authorized to reject this swap");
        }

        swap.setStatus(SwapRequestStatus.REJECTED);
        swap.setResponseNote(note);
        swap.setResolvedAt(LocalDateTime.now());
        SwapRequest saved = swapRequestRepository.save(swap);

        kafkaEventPublisher.swapResolved(swapId.toString(), "REJECTED",
                swap.getRequesterId(), targetId);

        return toResponse(saved);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private SwapRequest findOrThrow(UUID swapId) {
        return swapRequestRepository.findById(swapId)
                .orElseThrow(() -> new NoSuchElementException("Swap request not found: " + swapId));
    }

    private SwapRequestResponse toResponse(SwapRequest s) {
        return SwapRequestResponse.builder()
                .id(s.getId())
                .requesterId(s.getRequesterId())
                .targetId(s.getTargetId())
                .requesterReservationId(s.getRequesterReservationId())
                .targetReservationId(s.getTargetReservationId())
                .status(s.getStatus())
                .requesterNote(s.getRequesterNote())
                .responseNote(s.getResponseNote())
                .expiresAt(s.getExpiresAt())
                .resolvedAt(s.getResolvedAt())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
