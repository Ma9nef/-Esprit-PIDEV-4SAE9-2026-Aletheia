package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.response.CheckInEventResponse;
import com.esprit.microservice.resourcemanagement.entity.CheckInEvent;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.exception.ReservationNotFoundException;
import com.esprit.microservice.resourcemanagement.repository.CheckInEventRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class CheckInService {

    private final ReservationRepository reservationRepository;
    private final CheckInEventRepository checkInEventRepository;
    private final InstructorProfileService profileService;
    private final KafkaEventPublisher kafkaEventPublisher;

    @Value("${app.reservation.checkin-window-minutes:15}")
    private int checkInWindowMinutes;

    /**
     * Generate QR code PNG bytes for a confirmed reservation.
     * The QR content is the qrCodeToken stored on the reservation.
     */
    public byte[] generateQrCode(UUID reservationId) {
        Reservation reservation = reservationRepository.findByIdAndDeletedFalse(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(
                        "Reservation not found: " + reservationId));

        if (reservation.getQrCodeToken() == null) {
            throw new IllegalStateException("Reservation has no QR token (not yet confirmed?)");
        }

        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(reservation.getQrCodeToken(),
                    BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    /**
     * Validate a scanned QR token.
     * Window: [startTime − checkInWindowMinutes, startTime + checkInWindowMinutes]
     */
    public CheckInEventResponse validateScan(String token) {
        Reservation reservation = reservationRepository.findByQrCodeTokenAndDeletedFalse(token)
                .orElseThrow(() -> new ReservationNotFoundException(
                        "No reservation found for token"));

        LocalDateTime now        = LocalDateTime.now();
        LocalDateTime windowOpen = reservation.getStartTime().minusMinutes(checkInWindowMinutes);
        LocalDateTime windowClose = reservation.getStartTime().plusMinutes(checkInWindowMinutes);

        boolean valid = now.isAfter(windowOpen) && now.isBefore(windowClose)
                && reservation.getStatus() == ReservationStatus.CONFIRMED;

        CheckInEvent event = CheckInEvent.builder()
                .reservationId(reservation.getId())
                .scannedAt(now)
                .tokenUsed(token)
                .valid(valid)
                .build();
        checkInEventRepository.save(event);

        if (valid) {
            reservation.setCheckedInAt(now);
            reservation.setStatus(ReservationStatus.CHECKED_IN);
            reservationRepository.save(reservation);

            profileService.recordCheckIn(reservation.getInstructorId());

            kafkaEventPublisher.checkIn(
                    reservation.getId().toString(),
                    reservation.getInstructorId(),
                    now.toString());
        }

        return toResponse(event, reservation.getId());
    }

    @Transactional(readOnly = true)
    public CheckInEventResponse getCheckInForReservation(UUID reservationId) {
        CheckInEvent event = checkInEventRepository.findByReservationId(reservationId)
                .orElseThrow(() -> new ReservationNotFoundException(
                        "No check-in record for reservation " + reservationId));
        return toResponse(event, reservationId);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private CheckInEventResponse toResponse(CheckInEvent e, UUID reservationId) {
        return CheckInEventResponse.builder()
                .id(e.getId())
                .reservationId(reservationId)
                .scannedAt(e.getScannedAt())
                .tokenUsed(e.getTokenUsed())
                .valid(e.getValid())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
