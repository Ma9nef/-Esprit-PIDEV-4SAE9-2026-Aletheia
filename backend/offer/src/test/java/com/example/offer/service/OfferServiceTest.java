package com.example.offer.service;

import com.example.offer.dto.AppliedOfferDTO;
import com.example.offer.dto.OfferRequestDTO;
import com.example.offer.dto.OfferResponseDTO;
import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import com.example.offer.model.OfferType;
import com.example.offer.repository.OfferRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private OfferValidationService validationService;

    @Mock
    private OfferCalculationService calculationService;

    @InjectMocks
    private OfferService offerService;

    @Test
    void createOffer_shouldInitializeDefaultFieldsAndPersistOffer() {
        OfferRequestDTO request = new OfferRequestDTO();
        request.setName("Promo Printemps");
        request.setDescription("Reduction de 20%");
        request.setType(OfferType.PERCENTAGE);
        request.setValue(20.0);
        request.setCourseIds(List.of("course-1"));
        request.setCategoryIds(List.of("cat-1"));
        request.setUserIds(List.of("user-1"));
        request.setStartDate(LocalDateTime.of(2026, 4, 1, 10, 0));
        request.setEndDate(LocalDateTime.of(2026, 4, 30, 18, 0));
        request.setMaxUses(100);
        request.setMaxUsesPerUser(1);

        when(offerRepository.save(any(Offer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LocalDateTime beforeCall = LocalDateTime.now();
        Offer result = offerService.createOffer(request);
        LocalDateTime afterCall = LocalDateTime.now();

        assertEquals("Promo Printemps", result.getName());
        assertEquals(OfferType.PERCENTAGE, result.getType());
        assertEquals(20.0, result.getValue());
        assertEquals(0, result.getCurrentUses());
        assertEquals(OfferStatus.ACTIVE, result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        assertFalse(result.getCreatedAt().isBefore(beforeCall));
        assertFalse(result.getCreatedAt().isAfter(afterCall));
        assertFalse(result.getUpdatedAt().isBefore(beforeCall));
        assertFalse(result.getUpdatedAt().isAfter(afterCall));

        verify(offerRepository).save(result);
    }

    @Test
    void mapToResponseDTO_shouldReturnNullWhenOfferIsNull() {
        OfferResponseDTO result = offerService.mapToResponseDTO(null);

        assertNull(result);
    }

    @Test
    void applyOfferToUser_shouldReturnFailureResponseWhenValidationFails() {
        Offer offer = new Offer();
        offer.setId("offer-1");
        offer.setCurrentUses(2);

        when(offerRepository.findById("offer-1")).thenReturn(Optional.of(offer));
        doThrow(new RuntimeException("Offre expirée"))
                .when(validationService)
                .validateOffer(offer, "user-1");

        AppliedOfferDTO result = offerService.applyOfferToUser("offer-1", 100.0, "user-1");

        assertFalse(result.getSuccess());
        assertEquals(100.0, result.getOriginalPrice());
        assertEquals(100.0, result.getFinalPrice());
        assertEquals(0.0, result.getTotalDiscount());
        assertEquals(0.0, result.getDiscountPercentage());
        assertEquals(List.of("Offre expirée"), result.getMessages());
        assertEquals(2, offer.getCurrentUses());

        verify(offerRepository, never()).save(any(Offer.class));
    }

    @Test
    void applyOfferToUser_shouldApplyDiscountAndIncrementOfferUsage() {
        Offer offer = new Offer();
        offer.setId("offer-1");
        offer.setName("Promo");
        offer.setCurrentUses(3);

        when(offerRepository.findById("offer-1")).thenReturn(Optional.of(offer));
        when(calculationService.calculateDiscount(100.0, offer)).thenReturn(20.0);
        when(offerRepository.save(any(Offer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AppliedOfferDTO result = offerService.applyOfferToUser("offer-1", 100.0, "user-1");

        assertTrue(result.getSuccess());
        assertEquals(100.0, result.getOriginalPrice());
        assertEquals(80.0, result.getFinalPrice());
        assertEquals(20.0, result.getTotalDiscount());
        assertEquals(20.0, result.getDiscountPercentage());
        assertEquals(List.of("Offre appliquée avec succès!"), result.getMessages());
        assertEquals(4, offer.getCurrentUses());

        ArgumentCaptor<Offer> captor = ArgumentCaptor.forClass(Offer.class);
        verify(offerRepository).save(captor.capture());
        assertEquals(4, captor.getValue().getCurrentUses());
    }

    @Test
    void applyOffer_shouldReturnDiscountedPriceForValidOffer() {
        Offer offer = new Offer();
        offer.setId("offer-1");
        offer.setCurrentUses(0);

        when(offerRepository.findById("offer-1")).thenReturn(Optional.of(offer));
        when(calculationService.calculateDiscount(200.0, offer)).thenReturn(30.0);
        when(offerRepository.save(any(Offer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        double finalPrice = offerService.applyOffer("offer-1", 200.0, "user-42");

        assertEquals(170.0, finalPrice);
        verify(validationService).validateOffer(eq(offer), eq("user-42"));
        verify(offerRepository).save(offer);
        assertEquals(1, offer.getCurrentUses());
    }
}
