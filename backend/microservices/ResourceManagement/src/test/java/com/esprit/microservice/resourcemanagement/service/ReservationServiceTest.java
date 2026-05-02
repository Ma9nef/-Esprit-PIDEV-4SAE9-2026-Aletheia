package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CheckAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityCheckResponse;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.ReservationAuditLog;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.exception.InvalidTimeRangeException;
import com.esprit.microservice.resourcemanagement.exception.ReservationConflictException;
import com.esprit.microservice.resourcemanagement.exception.ReservationNotFoundException;
import com.esprit.microservice.resourcemanagement.mapper.ReservationMapper;
import com.esprit.microservice.resourcemanagement.mapper.ResourceMapper;
import com.esprit.microservice.resourcemanagement.repository.ReservationAuditLogRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ReservationService — Unit Tests")
class ReservationServiceTest {

    @Mock private ReservationRepository reservationRepository;
    @Mock private ResourceRepository resourceRepository;
    @Mock private ReservationAuditLogRepository auditLogRepository;
    @Mock private ResourceService resourceService;
    @Mock private ReservationMapper reservationMapper;
    @Mock private ResourceMapper resourceMapper;

    @InjectMocks
    private ReservationService reservationService;

    private UUID resourceId;
    private UUID reservationId;
    private Resource resource;
    private Reservation reservation;
    private ReservationResponse reservationResponse;
    private LocalDateTime start;
    private LocalDateTime end;

    @BeforeEach
    void setUp() {
        resourceId    = UUID.randomUUID();
        reservationId = UUID.randomUUID();
        start = LocalDateTime.now().plusHours(1);
        end   = LocalDateTime.now().plusHours(3);

        resource = Resource.builder()
                .id(resourceId).name("Lab 1").type(ResourceType.DEVICE)
                .deleted(false).build();

        reservation = Reservation.builder()
                .id(reservationId).resourceId(resourceId)
                .eventId("EVT-001").startTime(start).endTime(end)
                .status(ReservationStatus.PENDING).deleted(false).build();

        reservationResponse = ReservationResponse.builder()
                .id(reservationId).resourceId(resourceId)
                .eventId("EVT-001").startTime(start).endTime(end)
                .status(ReservationStatus.PENDING).build();
    }

    // ── createReservation ─────────────────────────────────────────────────────

    @Test
    @DisplayName("createReservation: should create and return reservation when no conflicts")
    void createReservation_success() {
        CreateReservationRequest request = CreateReservationRequest.builder()
                .resourceId(resourceId).eventId("EVT-001")
                .startTime(start).endTime(end).build();

        when(resourceService.findResourceOrThrow(resourceId)).thenReturn(resource);
        when(reservationRepository.findConflictingReservationsWithLock(resourceId, start, end))
                .thenReturn(List.of());
        when(reservationMapper.toEntity(request)).thenReturn(reservation);
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(auditLogRepository.save(any(ReservationAuditLog.class))).thenReturn(null);
        when(reservationMapper.toResponseWithResourceName(reservation, resource))
                .thenReturn(reservationResponse);

        ReservationResponse result = reservationService.createReservation(request, "user1");

        assertThat(result).isNotNull();
        assertThat(result.getEventId()).isEqualTo("EVT-001");
        assertThat(result.getStatus()).isEqualTo(ReservationStatus.PENDING);
        verify(reservationRepository).save(reservation);
        verify(auditLogRepository).save(any(ReservationAuditLog.class));
    }

    @Test
    @DisplayName("createReservation: should throw InvalidTimeRangeException when end <= start")
    void createReservation_invalidTimeRange() {
        CreateReservationRequest request = CreateReservationRequest.builder()
                .resourceId(resourceId).eventId("EVT-001")
                .startTime(end).endTime(start) // reversed
                .build();

        assertThatThrownBy(() -> reservationService.createReservation(request, "user1"))
                .isInstanceOf(InvalidTimeRangeException.class);

        verify(reservationRepository, never()).save(any());
    }

    @Test
    @DisplayName("createReservation: should throw ReservationConflictException when overlap found")
    void createReservation_conflict() {
        CreateReservationRequest request = CreateReservationRequest.builder()
                .resourceId(resourceId).eventId("EVT-002")
                .startTime(start).endTime(end).build();

        when(resourceService.findResourceOrThrow(resourceId)).thenReturn(resource);
        when(reservationRepository.findConflictingReservationsWithLock(resourceId, start, end))
                .thenReturn(List.of(reservation)); // conflict!

        assertThatThrownBy(() -> reservationService.createReservation(request, "user1"))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessageContaining("Lab 1");

        verify(reservationRepository, never()).save(any());
    }

    // ── confirmReservation ────────────────────────────────────────────────────

    @Test
    @DisplayName("confirmReservation: should transition PENDING → CONFIRMED")
    void confirmReservation_success() {
        reservation.setStatus(ReservationStatus.PENDING);
        when(reservationRepository.findByIdAndDeletedFalse(reservationId))
                .thenReturn(Optional.of(reservation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(auditLogRepository.save(any())).thenReturn(null);
        when(reservationMapper.toResponse(reservation)).thenReturn(
                ReservationResponse.builder().id(reservationId)
                        .status(ReservationStatus.CONFIRMED).build());

        ReservationResponse result = reservationService.confirmReservation(reservationId, "admin");

        assertThat(result.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
    }

    @Test
    @DisplayName("confirmReservation: should throw when reservation already CONFIRMED")
    void confirmReservation_alreadyConfirmed() {
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationRepository.findByIdAndDeletedFalse(reservationId))
                .thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.confirmReservation(reservationId, "admin"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("PENDING");
    }

    // ── cancelReservation ─────────────────────────────────────────────────────

    @Test
    @DisplayName("cancelReservation: should transition any status → CANCELLED")
    void cancelReservation_success() {
        reservation.setStatus(ReservationStatus.CONFIRMED);
        when(reservationRepository.findByIdAndDeletedFalse(reservationId))
                .thenReturn(Optional.of(reservation));
        when(reservationRepository.save(reservation)).thenReturn(reservation);
        when(auditLogRepository.save(any())).thenReturn(null);
        when(reservationMapper.toResponse(reservation)).thenReturn(
                ReservationResponse.builder().id(reservationId)
                        .status(ReservationStatus.CANCELLED).build());

        ReservationResponse result = reservationService.cancelReservation(reservationId, "user1");

        assertThat(result.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
        assertThat(reservation.getStatus()).isEqualTo(ReservationStatus.CANCELLED);
    }

    @Test
    @DisplayName("cancelReservation: should throw when already CANCELLED")
    void cancelReservation_alreadyCancelled() {
        reservation.setStatus(ReservationStatus.CANCELLED);
        when(reservationRepository.findByIdAndDeletedFalse(reservationId))
                .thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.cancelReservation(reservationId, "user1"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already cancelled");
    }

    // ── getReservationById ────────────────────────────────────────────────────

    @Test
    @DisplayName("getReservationById: should throw ReservationNotFoundException when not found")
    void getReservationById_notFound() {
        when(reservationRepository.findByIdAndDeletedFalse(reservationId))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.getReservationById(reservationId))
                .isInstanceOf(ReservationNotFoundException.class);
    }

    // ── checkAvailability ─────────────────────────────────────────────────────

    @Test
    @DisplayName("checkAvailability: should return available=true when no conflicts for resource")
    void checkAvailability_noConflict() {
        CheckAvailabilityRequest request = CheckAvailabilityRequest.builder()
                .resourceId(resourceId).startTime(start).endTime(end).build();

        when(resourceService.findResourceOrThrow(resourceId)).thenReturn(resource);
        when(reservationRepository.findConflictingReservations(resourceId, start, end))
                .thenReturn(List.of());
        when(resourceMapper.toResponse(resource)).thenReturn(
                com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse.builder()
                        .id(resourceId).name("Lab 1").type(ResourceType.DEVICE).build());

        AvailabilityCheckResponse result = reservationService.checkAvailability(request);

        assertThat(result.isAvailable()).isTrue();
        assertThat(result.getConflictingReservations()).isEmpty();
        assertThat(result.getAvailableResources()).hasSize(1);
    }

    @Test
    @DisplayName("checkAvailability: should return available=false when conflict exists")
    void checkAvailability_withConflict() {
        CheckAvailabilityRequest request = CheckAvailabilityRequest.builder()
                .resourceId(resourceId).startTime(start).endTime(end).build();

        when(resourceService.findResourceOrThrow(resourceId)).thenReturn(resource);
        when(reservationRepository.findConflictingReservations(resourceId, start, end))
                .thenReturn(List.of(reservation));
        when(reservationMapper.toResponse(reservation)).thenReturn(reservationResponse);

        AvailabilityCheckResponse result = reservationService.checkAvailability(request);

        assertThat(result.isAvailable()).isFalse();
        assertThat(result.getConflictingReservations()).hasSize(1);
    }

    @Test
    @DisplayName("checkAvailability: should throw InvalidTimeRangeException when end <= start")
    void checkAvailability_invalidTimeRange() {
        CheckAvailabilityRequest request = CheckAvailabilityRequest.builder()
                .resourceId(resourceId).startTime(end).endTime(start).build();

        assertThatThrownBy(() -> reservationService.checkAvailability(request))
                .isInstanceOf(InvalidTimeRangeException.class);
    }
}
