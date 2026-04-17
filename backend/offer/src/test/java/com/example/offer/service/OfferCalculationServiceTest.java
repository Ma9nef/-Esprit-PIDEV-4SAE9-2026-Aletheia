package com.example.offer.service;

import com.example.offer.analytics.OfferHistoryService;
import com.example.offer.model.Offer;
import com.example.offer.model.OfferType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class OfferCalculationServiceTest {

    @Mock
    private OfferHistoryService offerHistoryService;

    @InjectMocks
    private OfferCalculationService offerCalculationService;

    @Test
    void calculateDiscount_shouldReturnPercentageDiscount() {
        Offer offer = new Offer();
        offer.setType(OfferType.PERCENTAGE);
        offer.setValue(25.0);

        double discount = offerCalculationService.calculateDiscount(200.0, offer);

        assertEquals(50.0, discount);
    }

    @Test
    void calculateDiscount_shouldReturnFixedAmountDiscount() {
        Offer offer = new Offer();
        offer.setType(OfferType.FIXED_AMOUNT);
        offer.setValue(30.0);

        double discount = offerCalculationService.calculateDiscount(200.0, offer);

        assertEquals(30.0, discount);
    }

    @Test
    void calculateDiscount_shouldReturnZeroForUnsupportedOfferType() {
        Offer offer = new Offer();
        offer.setType(OfferType.BUY_ONE_GET_ONE);
        offer.setValue(99.0);

        double discount = offerCalculationService.calculateDiscount(200.0, offer);

        assertEquals(0.0, discount);
    }

    @Test
    void calculateDiscount_shouldHandleZeroPriceForPercentageOffer() {
        Offer offer = new Offer();
        offer.setType(OfferType.PERCENTAGE);
        offer.setValue(20.0);

        double discount = offerCalculationService.calculateDiscount(0.0, offer);

        assertEquals(0.0, discount);
    }
}
