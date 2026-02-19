package com.example.offer.service;

import com.example.offer.dto.AppliedOfferDTO;
import com.example.offer.dto.CouponRequestDTO;
import com.example.offer.model.Coupon;
import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import com.example.offer.repository.CouponRepository;
import com.example.offer.repository.OfferRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;
    private final OfferRepository offerRepository;
    private final OfferValidationService validationService;
    private final OfferCalculationService calculationService;

    // ✅ 1. Créer un coupon (pour POST /api/coupons)
    public Coupon createCoupon(CouponRequestDTO requestDTO) {
        // Vérifier que l'offre existe
        Offer offer = offerRepository.findById(requestDTO.getOfferId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée avec l'ID: " + requestDTO.getOfferId()));

        // Générer un code si non fourni
        String code = requestDTO.getCode();
        if (code == null || code.isEmpty()) {
            code = generateUniqueCode();
        } else {
            // Vérifier que le code n'existe pas déjà
            if (couponRepository.existsByCode(code)) {
                throw new RuntimeException("Un coupon avec ce code existe déjà: " + code);
            }
        }

        Coupon coupon = new Coupon();
        coupon.setCode(code);
        coupon.setOfferId(requestDTO.getOfferId());
        coupon.setDescription(requestDTO.getDescription());
        coupon.setIsUnique(requestDTO.getIsUnique() != null ? requestDTO.getIsUnique() : false);
        coupon.setAssignedUserId(requestDTO.getAssignedUserId());
        coupon.setValidFrom(requestDTO.getValidFrom());
        coupon.setValidUntil(requestDTO.getValidUntil());

        // Gérer les utilisations selon le type
        if (Boolean.TRUE.equals(coupon.getIsUnique())) {
            coupon.setMaxUses(1);
            coupon.setRemainingUses(1);
        } else {
            coupon.setMaxUses(requestDTO.getMaxUses() != null ? requestDTO.getMaxUses() : 1);
            coupon.setRemainingUses(coupon.getMaxUses());
        }

        coupon.setStatus(OfferStatus.ACTIVE);
        coupon.setCreatedAt(LocalDateTime.now());

        return couponRepository.save(coupon);
    }

    // ✅ 2. Récupérer tous les coupons (pour GET /api/coupons)
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    // ✅ 3. Récupérer un coupon par son code (pour GET /api/coupons/{code})
    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon non trouvé avec le code: " + code));
    }

    // ✅ 4. Appliquer un coupon et retourner AppliedOfferDTO
    public AppliedOfferDTO applyCouponToUser(String code, double price, String userId) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon invalide: " + code));

        // Vérifications
        if (LocalDateTime.now().isAfter(coupon.getValidUntil())) {
            return AppliedOfferDTO.builder()
                    .originalPrice(price)
                    .finalPrice(price)
                    .totalDiscount(0.0)
                    .discountPercentage(0.0)
                    .success(false)
                    .messages(List.of("Coupon expiré"))
                    .build();
        }

        if (coupon.getRemainingUses() != null && coupon.getRemainingUses() <= 0) {
            return AppliedOfferDTO.builder()
                    .originalPrice(price)
                    .finalPrice(price)
                    .totalDiscount(0.0)
                    .discountPercentage(0.0)
                    .success(false)
                    .messages(List.of("Coupon épuisé"))
                    .build();
        }

        Offer offer = offerRepository.findById(coupon.getOfferId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée pour ce coupon"));

        // Validation de l'offre
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

        coupon.setRemainingUses(coupon.getRemainingUses() - 1);
        couponRepository.save(coupon);

        return AppliedOfferDTO.builder()
                .originalPrice(price)
                .finalPrice(finalPrice)
                .totalDiscount(discount)
                .discountPercentage((discount / price) * 100)
                .success(true)
                .messages(List.of("Coupon appliqué avec succès!"))
                .build();
    }

    // ✅ 5. Appliquer un coupon (version simple)
    public double applyCoupon(String code, double price, String userId) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Coupon invalide"));

        if (LocalDateTime.now().isAfter(coupon.getValidUntil())) {
            throw new RuntimeException("Coupon expiré");
        }

        if (coupon.getRemainingUses() != null && coupon.getRemainingUses() <= 0) {
            throw new RuntimeException("Coupon épuisé");
        }

        Offer offer = offerRepository.findById(coupon.getOfferId())
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));

        validationService.validateOffer(offer, userId);

        double discount = calculationService.calculateDiscount(price, offer);

        coupon.setRemainingUses(coupon.getRemainingUses() - 1);
        couponRepository.save(coupon);

        return price - discount;
    }

    // ✅ 6. Méthode utilitaire pour générer un code unique
    private String generateUniqueCode() {
        String code;
        do {
            code = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (couponRepository.existsByCode(code));
        return code;
    }
}