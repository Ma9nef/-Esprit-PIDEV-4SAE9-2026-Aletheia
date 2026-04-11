package com.example.offer.service;

import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OfferValidationService {

    public void validateOffer(Offer offer, String userId) {

        // Vérifier si l'offre est active
        if (offer.getStatus() != OfferStatus.ACTIVE) {
            throw new RuntimeException("Offre inactive");
        }

        // Vérifier les dates de validité
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(offer.getStartDate())) {
            throw new RuntimeException("L'offre n'a pas encore commencé");
        }
        if (now.isAfter(offer.getEndDate())) {
            throw new RuntimeException("L'offre est expirée");
        }

        // Vérifier le nombre maximum d'utilisations
        if (offer.getMaxUses() != null &&
                offer.getCurrentUses() >= offer.getMaxUses()) {
            throw new RuntimeException("Nombre maximum d'utilisations atteint");
        }

        // Vérifier si l'utilisateur est éligible (si des userIds sont spécifiés)
        if (offer.getUserIds() != null && !offer.getUserIds().isEmpty()
                && !offer.getUserIds().contains(userId)) {
            throw new RuntimeException("Vous n'êtes pas éligible à cette offre");
        }
    }
}