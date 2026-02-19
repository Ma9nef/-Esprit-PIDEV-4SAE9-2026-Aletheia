package com.example.offer.service;

import com.example.offer.dto.AppliedOfferDTO;
import com.example.offer.dto.OfferRequestDTO;
import com.example.offer.dto.OfferResponseDTO;
import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import com.example.offer.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.offer.model.OfferStatus;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final OfferValidationService validationService;
    private final OfferCalculationService calculationService;
    // ✅ NOUVELLE MÉTHODE: Créer une offre
    public Offer createOffer(OfferRequestDTO requestDTO) {
        Offer offer = new Offer();
        offer.setName(requestDTO.getName());
        offer.setDescription(requestDTO.getDescription());
        offer.setType(requestDTO.getType());
        offer.setValue(requestDTO.getValue());
        offer.setCourseIds(requestDTO.getCourseIds());
        offer.setCategoryIds(requestDTO.getCategoryIds());
        offer.setUserIds(requestDTO.getUserIds());
        offer.setStartDate(requestDTO.getStartDate());
        offer.setEndDate(requestDTO.getEndDate());
        offer.setMaxUses(requestDTO.getMaxUses());
        offer.setMaxUsesPerUser(requestDTO.getMaxUsesPerUser());
        offer.setCurrentUses(0);
        offer.setStatus(OfferStatus.ACTIVE);
        offer.setCreatedAt(LocalDateTime.now());
        offer.setUpdatedAt(LocalDateTime.now());

        return offerRepository.save(offer);
    }

    // ✅ NOUVELLE MÉTHODE: Mapper Offer vers OfferResponseDTO
    public OfferResponseDTO mapToResponseDTO(Offer offer) {
        if (offer == null) return null;

        OfferResponseDTO dto = new OfferResponseDTO();
        dto.setId(offer.getId());
        dto.setName(offer.getName());
        dto.setDescription(offer.getDescription());
        dto.setType(offer.getType());
        dto.setValue(offer.getValue());
        dto.setCourseIds(offer.getCourseIds());
        dto.setCategoryIds(offer.getCategoryIds());
        dto.setUserIds(offer.getUserIds());
        dto.setStartDate(offer.getStartDate());
        dto.setEndDate(offer.getEndDate());
        dto.setMaxUses(offer.getMaxUses());
        dto.setMaxUsesPerUser(offer.getMaxUsesPerUser());
        dto.setCurrentUses(offer.getCurrentUses());
        dto.setStatus(offer.getStatus());
        dto.setCreatedAt(offer.getCreatedAt());
        dto.setUpdatedAt(offer.getUpdatedAt());

        return dto;
    }
    // ✅ NOUVELLE MÉTHODE: Récupérer les offres actives
    public List<Offer> getActiveOffers() {
        return offerRepository.findByStatus(OfferStatus.ACTIVE);
    }


    // ✅ NOUVELLE MÉTHODE: Appliquer une offre et retourner AppliedOfferDTO
    public AppliedOfferDTO applyOfferToUser(String offerId, double price, String userId) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        try {
            validationService.validateOffer(offer, userId);
        } catch (RuntimeException e) {
            return AppliedOfferDTO.builder()
                    .originalPrice(price)
                    .finalPrice(price)
                    .totalDiscount(0.0)
                    .discountPercentage(0.0)
                    .success(false)
                    .messages(List.of(e.getMessage()))
                    .build();
        }

        double discount = calculationService.calculateDiscount(price, offer);
        double finalPrice = price - discount;

        offer.setCurrentUses(offer.getCurrentUses() + 1);
        offerRepository.save(offer);

        return AppliedOfferDTO.builder()
                .originalPrice(price)
                .finalPrice(finalPrice)
                .totalDiscount(discount)
                .discountPercentage((discount / price) * 100)
                .success(true)
                .messages(List.of("Offre appliquée avec succès!"))
                .build();
    }

    public double applyOffer(String offerId, double price, String userId) {

        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        validationService.validateOffer(offer, userId);

        double discount = calculationService.calculateDiscount(price, offer);

        offer.setCurrentUses(offer.getCurrentUses() + 1);
        offerRepository.save(offer);

        return price - discount;
    }
}
