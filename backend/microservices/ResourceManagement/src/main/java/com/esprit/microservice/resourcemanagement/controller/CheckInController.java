package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.response.CheckInEventResponse;
import com.esprit.microservice.resourcemanagement.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/checkin")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    /** GET /api/checkin/{reservationId}/qr → PNG image bytes */
    @GetMapping(value = "/{reservationId}/qr", produces = MediaType.IMAGE_PNG_VALUE)
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<byte[]> getQrCode(@PathVariable UUID reservationId) {
        byte[] png = checkInService.generateQrCode(reservationId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(png);
    }

    /** POST /api/checkin/scan  body: { "token": "..." } */
    @PostMapping("/scan")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<CheckInEventResponse> scan(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Field 'token' is required");
        }
        return ResponseEntity.ok(checkInService.validateScan(token));
    }

    /** GET /api/checkin/reservation/{id} */
    @GetMapping("/reservation/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<CheckInEventResponse> getCheckIn(@PathVariable UUID id) {
        return ResponseEntity.ok(checkInService.getCheckInForReservation(id));
    }
}
