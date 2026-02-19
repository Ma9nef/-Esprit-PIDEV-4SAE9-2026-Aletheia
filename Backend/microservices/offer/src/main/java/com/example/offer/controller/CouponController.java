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

    // Récupérer un coupon par code
    @GetMapping("/{code}")
    public ResponseEntity<Coupon> getCouponByCode(@PathVariable String code) {
        Coupon coupon = couponService.getCouponByCode(code);
        return ResponseEntity.ok(coupon);
    }
}
