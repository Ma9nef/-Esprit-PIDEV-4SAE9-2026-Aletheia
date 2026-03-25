package com.example.offer.controller;

import com.example.offer.dto.CouponRequestDTO;
import com.example.offer.model.Coupon;
import com.example.offer.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Créer un coupon
    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@Valid @RequestBody CouponRequestDTO requestDTO) {
        Coupon coupon = couponService.createCoupon(requestDTO);
        return ResponseEntity.ok(coupon);
    }

    // Lister tous les coupons
    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    // Récupérer un coupon par ID
    @GetMapping("/{id}")
    public ResponseEntity<Coupon> getCouponById(@PathVariable String id) {
        Coupon coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(coupon);
    }

    // Récupérer un coupon par code (endpoint alternatif pour éviter conflit avec id)
    @GetMapping("/by-code/{code}")
    public ResponseEntity<Coupon> getCouponByCode(@PathVariable String code) {
        Coupon coupon = couponService.getCouponByCode(code);
        return ResponseEntity.ok(coupon);
    }

    // Mettre à jour un coupon
    @PutMapping("/{id}")
    public ResponseEntity<Coupon> updateCoupon(
            @PathVariable String id,
            @Valid @RequestBody CouponRequestDTO requestDTO) {
        Coupon coupon = couponService.updateCoupon(id, requestDTO);
        return ResponseEntity.ok(coupon);
    }

    // Supprimer un coupon
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable String id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
