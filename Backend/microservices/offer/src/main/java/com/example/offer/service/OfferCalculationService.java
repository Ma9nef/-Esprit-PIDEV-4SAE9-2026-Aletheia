package com.example.offer.service;

import com.example.offer.model.Offer;
import com.example.offer.model.OfferType;
import org.springframework.stereotype.Service;

@Service
public class OfferCalculationService {

    public double calculateDiscount(double price, Offer offer) {

        if (offer.getType() == OfferType.PERCENTAGE) {
            return price * offer.getValue() / 100;
        }

        if (offer.getType() == OfferType.FIXED_AMOUNT) {
            return offer.getValue();
        }

        return 0;
    }
}
