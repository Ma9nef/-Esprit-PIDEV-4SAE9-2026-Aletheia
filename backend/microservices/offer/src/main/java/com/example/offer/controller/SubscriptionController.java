package com.example.offer.controller;

import com.example.offer.dto.SubscriptionCheckoutRequestDTO;
import com.example.offer.dto.SubscriptionCheckoutResponseDTO;
import com.example.offer.dto.SubscriptionPaymentResponseDTO;
import com.example.offer.dto.SubscriptionRequestDTO;
import com.example.offer.dto.SubscriptionResponseDTO;
import com.example.offer.dto.UserSubscriptionDTO;
import com.example.offer.service.SubscriptionPaymentService;
import com.example.offer.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final SubscriptionPaymentService subscriptionPaymentService;

    @GetMapping
    public ResponseEntity<List<SubscriptionResponseDTO>> getAllSubscriptions() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionResponseDTO> getSubscriptionById(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionResponseDTO>> getSubscriptionsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(subscriptionService.getSubscriptionsByUser(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<UserSubscriptionDTO> getActiveSubscriptionByUser(@PathVariable String userId) {
        return ResponseEntity.ok(subscriptionService.getActiveSubscriptionByUser(userId));
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponseDTO> createSubscription(@RequestBody SubscriptionRequestDTO request) {
        return new ResponseEntity<>(subscriptionService.createSubscription(request), HttpStatus.CREATED);
    }

    @PostMapping("/checkout-session")
    public ResponseEntity<SubscriptionCheckoutResponseDTO> createCheckoutSession(
            @RequestBody SubscriptionCheckoutRequestDTO request
    ) {
        return ResponseEntity.ok(subscriptionPaymentService.createCheckoutSession(request));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<SubscriptionResponseDTO> cancelSubscription(@PathVariable String id) {
        return ResponseEntity.ok(subscriptionService.cancelSubscription(id));
    }

    @PostMapping(value = "/payments/webhook", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String signatureHeader
    ) {
        return ResponseEntity.ok(subscriptionPaymentService.handleStripeWebhook(payload, signatureHeader));
    }

    @GetMapping("/payments")
    public ResponseEntity<List<SubscriptionPaymentResponseDTO>> getAllPaymentHistory() {
        return ResponseEntity.ok(subscriptionPaymentService.getAllPaymentHistory());
    }

    @GetMapping("/payments/user/{userId}")
    public ResponseEntity<List<SubscriptionPaymentResponseDTO>> getPaymentHistoryByUser(@PathVariable String userId) {
        return ResponseEntity.ok(subscriptionPaymentService.getPaymentHistoryByUser(userId));
    }

}