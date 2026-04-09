package com.example.offer.service;

import com.example.offer.model.FlashSale;
import com.example.offer.model.Offer;
import com.example.offer.repository.FlashSaleRepository;
import com.example.offer.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class FlashSaleService {

    private final FlashSaleRepository flashSaleRepository;
    private final OfferRepository offerRepository;
    private final OfferValidationService validationService;
    private final OfferCalculationService calculationService;

    // ✅ 1. Créer une FlashSale
    public FlashSale createFlashSale(FlashSale flashSale) {
        log.info("Création d'une nouvelle vente flash: {}", flashSale.getName());

        // Vérifier que l'offre associée existe
        if (flashSale.getOfferId() != null) {
            Offer offer = offerRepository.findById(flashSale.getOfferId())
                    .orElseThrow(() -> new RuntimeException("Offre non trouvée avec l'ID: " + flashSale.getOfferId()));
        }

        // Valider les dates
        if (flashSale.getStartTime() != null && flashSale.getEndTime() != null) {
            if (flashSale.getStartTime().isAfter(flashSale.getEndTime())) {
                throw new RuntimeException("La date de début doit être antérieure à la date de fin");
            }
            if (flashSale.getStartTime().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("La date de début doit être dans le futur");
            }
        }

        // Initialiser les valeurs par défaut
        if (flashSale.getCurrentUsers() == null) {
            flashSale.setCurrentUsers(0);
        }
        if (flashSale.getIsActive() == null) {
            flashSale.setIsActive(true);
        }


        return flashSaleRepository.save(flashSale);
    }

    // ✅ 2. Récupérer toutes les FlashSales actives
    public List<FlashSale> getActiveFlashSales() {
        LocalDateTime now = LocalDateTime.now();
        return flashSaleRepository.findByIsActiveTrueAndStartTimeBeforeAndEndTimeAfter(now, now);
    }

    // ✅ 3. Appliquer une FlashSale à un utilisateur
    public boolean applyFlashSale(String flashSaleId, String userId) {
        log.info("Application de la flash sale {} pour l'utilisateur {}", flashSaleId, userId);

        FlashSale flashSale = flashSaleRepository.findById(flashSaleId)
                .orElseThrow(() -> new RuntimeException("FlashSale non trouvée avec l'ID: " + flashSaleId));

        // Vérifier si la flash sale est active
        if (!flashSale.getIsActive()) {
            log.warn("FlashSale {} n'est pas active", flashSaleId);
            return false;
        }

        // Vérifier les dates
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(flashSale.getStartTime())) {
            log.warn("FlashSale {} n'a pas encore commencé", flashSaleId);
            return false;
        }
        if (now.isAfter(flashSale.getEndTime())) {
            log.warn("FlashSale {} est expirée", flashSaleId);
            return false;
        }

        // Vérifier le nombre maximum d'utilisateurs
        if (flashSale.getCurrentUsers() >= flashSale.getMaxUsers()) {
            log.warn("FlashSale {} a atteint son nombre maximum d'utilisateurs", flashSaleId);
            return false;
        }

        // Incrémenter le nombre d'utilisateurs
        flashSale.setCurrentUsers(flashSale.getCurrentUsers() + 1);

        // Désactiver si le maximum est atteint
        if (flashSale.getCurrentUsers() >= flashSale.getMaxUsers()) {
            flashSale.setIsActive(false);
        }

        flashSaleRepository.save(flashSale);
        log.info("FlashSale {} appliquée avec succès à l'utilisateur {}", flashSaleId, userId);

        return true;
    }

    // ✅ 4. Récupérer une FlashSale par son ID
    public FlashSale getFlashSaleById(String id) {
        return flashSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashSale non trouvée avec l'ID: " + id));
    }

    // ✅ 5. Récupérer toutes les FlashSales
    public List<FlashSale> getAllFlashSales() {
        return flashSaleRepository.findAll();
    }

    // ✅ 6. Mettre à jour une FlashSale
    public FlashSale updateFlashSale(String id, FlashSale flashSaleDetails) {
        FlashSale existingFlashSale = getFlashSaleById(id);

        existingFlashSale.setName(flashSaleDetails.getName());
        existingFlashSale.setDescription(flashSaleDetails.getDescription());
        existingFlashSale.setOfferId(flashSaleDetails.getOfferId());
        existingFlashSale.setStartTime(flashSaleDetails.getStartTime());
        existingFlashSale.setEndTime(flashSaleDetails.getEndTime());
        existingFlashSale.setMaxUsers(flashSaleDetails.getMaxUsers());
        existingFlashSale.setIsActive(flashSaleDetails.getIsActive());


        return flashSaleRepository.save(existingFlashSale);
    }

    // ✅ 7. Supprimer une FlashSale
    public void deleteFlashSale(String id) {
        if (!flashSaleRepository.existsById(id)) {
            throw new RuntimeException("FlashSale non trouvée avec l'ID: " + id);
        }
        flashSaleRepository.deleteById(id);
    }

}