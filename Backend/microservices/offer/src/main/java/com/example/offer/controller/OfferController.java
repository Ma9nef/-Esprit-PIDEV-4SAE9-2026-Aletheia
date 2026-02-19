
package com.example.offer.controller;

import com.example.offer.dto.AppliedOfferDTO;
import com.example.offer.dto.OfferRequestDTO;
import com.example.offer.dto.OfferResponseDTO;
import com.example.offer.model.Offer;
import com.example.offer.service.CouponService;
import com.example.offer.service.OfferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;
    private final CouponService couponService;

    // Créer une offre
    @PostMapping
    public ResponseEntity<OfferResponseDTO> createOffer(@Valid @RequestBody OfferRequestDTO requestDTO) {
        Offer offer = offerService.createOffer(requestDTO);
        return ResponseEntity.ok(offerService.mapToResponseDTO(offer));
    }

    // Lister toutes les offres actives
    @GetMapping("/active")
    public ResponseEntity<List<OfferResponseDTO>> getActiveOffers() {
        List<Offer> offers = offerService.getActiveOffers();
        List<OfferResponseDTO> response = offers.stream()
                .map(offerService::mapToResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Appliquer une offre
    @PostMapping("/{offerId}/apply")
    public ResponseEntity<AppliedOfferDTO> applyOffer(
            @PathVariable String offerId,
            @RequestParam double price,
            @RequestParam String userId) {

        AppliedOfferDTO dto = offerService.applyOfferToUser(offerId, price, userId);
        return ResponseEntity.ok(dto);
    }

    // Appliquer un coupon
    @PostMapping("/apply-coupon")
    public ResponseEntity<AppliedOfferDTO> applyCoupon(
            @RequestParam String code,
            @RequestParam double price,
            @RequestParam String userId) {

        AppliedOfferDTO dto = couponService.applyCouponToUser(code, price, userId);
        return ResponseEntity.ok(dto);
    }
}

