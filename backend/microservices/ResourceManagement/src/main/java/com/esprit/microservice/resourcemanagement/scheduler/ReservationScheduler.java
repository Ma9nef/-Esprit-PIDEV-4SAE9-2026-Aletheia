package com.esprit.microservice.resourcemanagement.scheduler;

import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.SwapRequest;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.SwapRequestStatus;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.SwapRequestRepository;
import com.esprit.microservice.resourcemanagement.service.InstructorProfileService;
import com.esprit.microservice.resourcemanagement.service.KafkaEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled tasks for resource management housekeeping:
 * 1. No-show detection (every 5 minutes)
 * 2. PENDING reservation expiry (every 10 minutes)
 * 3. Swap request expiry (every 30 minutes)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final SwapRequestRepository swapRequestRepository;
    private final InstructorProfileService profileService;
    private final KafkaEventPublisher kafkaEventPublisher;

    /**
     * Every 5 minutes: find CONFIRMED reservations where startTime + 30 min has passed
     * and the instructor never checked in → mark as no-show, deduct score.
     */
    @Scheduled(fixedDelayString = "${app.scheduler.noshow-check-ms:300000}")
    @Transactional
    public void detectNoShows() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(30);
        List<Reservation> candidates = reservationRepository.findConfirmedWithoutCheckIn(cutoff);

        if (!candidates.isEmpty()) {
            log.info("No-show check: {} candidate(s)", candidates.size());
        }

        for (Reservation reservation : candidates) {
            reservation.setNoShow(true);
            reservation.setStatus(ReservationStatus.COMPLETED);
            reservationRepository.save(reservation);

            profileService.recordNoShow(reservation.getInstructorId());

            kafkaEventPublisher.noShowDetected(
                    reservation.getId().toString(),
                    reservation.getInstructorId(),
                    reservation.getResource() != null
                            ? reservation.getResource().getId().toString() : "");

            log.info("No-show detected for reservation {} (instructor {})",
                    reservation.getId(), reservation.getInstructorId());
        }
    }

    /**
     * Every 10 minutes: expire PENDING reservations that have passed their expiresAt.
     */
    @Scheduled(fixedDelayString = "${app.scheduler.expiry-check-ms:600000}")
    @Transactional
    public void expirePendingReservations() {
        List<Reservation> expired = reservationRepository
                .findExpiredPendingReservations(LocalDateTime.now());

        if (!expired.isEmpty()) {
            log.info("Expiring {} pending reservation(s)", expired.size());
        }

        for (Reservation r : expired) {
            r.setStatus(ReservationStatus.CANCELLED);
            r.setCancellationReason("Pending reservation expired without admin approval");
            reservationRepository.save(r);
            log.info("Expired pending reservation {}", r.getId());
        }
    }

    /**
     * Every 30 minutes: expire PENDING swap requests older than 24 hours.
     */
    @Scheduled(fixedDelayString = "${app.scheduler.swap-expiry-check-ms:1800000}")
    @Transactional
    public void expireSwapRequests() {
        List<SwapRequest> expired = swapRequestRepository
                .findByStatusAndExpiresAtBefore(SwapRequestStatus.PENDING, LocalDateTime.now());

        if (!expired.isEmpty()) {
            log.info("Expiring {} swap request(s)", expired.size());
        }

        for (SwapRequest swap : expired) {
            swap.setStatus(SwapRequestStatus.EXPIRED);
            swap.setResolvedAt(LocalDateTime.now());
            swapRequestRepository.save(swap);
            log.info("Expired swap request {}", swap.getId());
        }
    }
}
