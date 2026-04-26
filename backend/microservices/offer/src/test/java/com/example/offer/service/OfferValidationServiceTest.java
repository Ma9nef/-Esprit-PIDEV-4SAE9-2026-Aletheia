package com.example.offer.service;

import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class OfferValidationServiceTest {

    private final OfferValidationService offerValidationService = new OfferValidationService();

    @Test
    void validateOffer_shouldRejectInactiveOffer() {
        Offer offer = validOffer();
        offer.setStatus(OfferStatus.INACTIVE);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> offerValidationService.validateOffer(offer, "user-1")
        );

        assertEquals("Offre inactive", exception.getMessage());
    }

    @Test
    void validateOffer_shouldRejectOfferThatHasNotStartedYet() {
        Offer offer = validOffer();
        offer.setStartDate(LocalDateTime.now().plusDays(1));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> offerValidationService.validateOffer(offer, "user-1")
        );

        assertEquals("L'offre n'a pas encore commencé", exception.getMessage());
    }

    @Test
    void validateOffer_shouldRejectExpiredOffer() {
        Offer offer = validOffer();
        offer.setEndDate(LocalDateTime.now().minusMinutes(1));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> offerValidationService.validateOffer(offer, "user-1")
        );

        assertEquals("L'offre est expirée", exception.getMessage());
    }

    @Test
    void validateOffer_shouldRejectOfferWhenMaxUsageIsReached() {
        Offer offer = validOffer();
        offer.setMaxUses(5);
        offer.setCurrentUses(5);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> offerValidationService.validateOffer(offer, "user-1")
        );

        assertEquals("Nombre maximum d'utilisations atteint", exception.getMessage());
    }

    @Test
    void validateOffer_shouldRejectUnauthorizedUser() {
        Offer offer = validOffer();
        offer.setUserIds(List.of("eligible-user"));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> offerValidationService.validateOffer(offer, "user-1")
        );

        assertEquals("Vous n'êtes pas éligible à cette offre", exception.getMessage());
    }

    @Test
    void validateOffer_shouldAcceptOfferWhenAllRulesAreSatisfied() {
        Offer offer = validOffer();
        offer.setUserIds(List.of("user-1", "user-2"));

        assertDoesNotThrow(() -> offerValidationService.validateOffer(offer, "user-1"));
    }

    private Offer validOffer() {
        Offer offer = new Offer();
        offer.setStatus(OfferStatus.ACTIVE);
        offer.setStartDate(LocalDateTime.now().minusDays(1));
        offer.setEndDate(LocalDateTime.now().plusDays(1));
        offer.setCurrentUses(1);
        offer.setMaxUses(10);
        return offer;
    }
}
