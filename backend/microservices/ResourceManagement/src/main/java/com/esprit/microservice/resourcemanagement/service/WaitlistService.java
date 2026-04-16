package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateWaitlistRequest;
import com.esprit.microservice.resourcemanagement.dto.response.WaitlistEntryResponse;
import com.esprit.microservice.resourcemanagement.entity.WaitlistEntry;
import com.esprit.microservice.resourcemanagement.entity.enums.WaitlistStatus;
import com.esprit.microservice.resourcemanagement.exception.WaitlistException;
import com.esprit.microservice.resourcemanagement.repository.WaitlistEntryRepository;
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
public class WaitlistService {

    private final WaitlistEntryRepository waitlistEntryRepository;
    private final InstructorProfileService profileService;
    private final KafkaEventPublisher kafkaEventPublisher;

    @Transactional(readOnly = true)
    public List<WaitlistEntryResponse> listOwn(String instructorId) {
        return waitlistEntryRepository.findByInstructorId(instructorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WaitlistEntryResponse join(CreateWaitlistRequest req, String instructorId) {
        // Guard: don't join twice for the same slot
        boolean alreadyWaiting = waitlistEntryRepository
                .existsByResourceIdAndInstructorIdAndStatusAndStartTimeAndEndTime(
                        req.getResourceId(), instructorId, WaitlistStatus.WAITING,
                        req.getStartTime(), req.getEndTime());
        if (alreadyWaiting) {
            throw new WaitlistException("Already on waitlist for this slot");
        }

        // Calculate queue position; trusted instructors go to position 1
        boolean trusted = profileService.getOrCreate(instructorId).getIsTrusted();
        int maxPos = waitlistEntryRepository.findMaxPositionForResource(req.getResourceId());
        int position = trusted ? 1 : maxPos + 1;

        // If inserted at position 1 as trusted, shift everyone else down
        if (trusted && maxPos > 0) {
            List<WaitlistEntry> existing = waitlistEntryRepository
                    .findWaitingByResourceAndSlot(req.getResourceId(),
                            req.getStartTime(), req.getEndTime());
            existing.forEach(e -> {
                e.setPosition(e.getPosition() + 1);
                waitlistEntryRepository.save(e);
            });
        }

        WaitlistEntry entry = WaitlistEntry.builder()
                .resourceId(req.getResourceId())
                .instructorId(instructorId)
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .position(position)
                .status(WaitlistStatus.WAITING)
                .build();

        return toResponse(waitlistEntryRepository.save(entry));
    }

    public void leave(UUID entryId, String instructorId) {
        WaitlistEntry entry = waitlistEntryRepository.findById(entryId)
                .orElseThrow(() -> new NoSuchElementException("Waitlist entry not found: " + entryId));
        if (!entry.getInstructorId().equals(instructorId)) {
            throw new IllegalArgumentException("Waitlist entry does not belong to current instructor");
        }
        waitlistEntryRepository.deleteById(entryId);
    }

    /**
     * Called by ReservationService after a cancellation.
     * Notifies the first WAITING entry for the freed slot.
     */
    public void processWaitlistAfterCancellation(UUID resourceId,
                                                  LocalDateTime startTime,
                                                  LocalDateTime endTime) {
        List<WaitlistEntry> waiters = waitlistEntryRepository
                .findWaitingByResourceAndSlot(resourceId, startTime, endTime);
        if (waiters.isEmpty()) return;

        WaitlistEntry first = waiters.get(0);
        first.setStatus(WaitlistStatus.NOTIFIED);
        first.setNotifiedAt(LocalDateTime.now());
        waitlistEntryRepository.save(first);

        kafkaEventPublisher.waitlistNotified(
                first.getId().toString(),
                first.getInstructorId(),
                resourceId.toString());

        log.info("Notified waitlist entry {} for instructor {}",
                first.getId(), first.getInstructorId());
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private WaitlistEntryResponse toResponse(WaitlistEntry w) {
        return WaitlistEntryResponse.builder()
                .id(w.getId())
                .resourceId(w.getResourceId())
                .instructorId(w.getInstructorId())
                .startTime(w.getStartTime())
                .endTime(w.getEndTime())
                .position(w.getPosition())
                .status(w.getStatus())
                .notifiedAt(w.getNotifiedAt())
                .createdAt(w.getCreatedAt())
                .build();
    }
}
