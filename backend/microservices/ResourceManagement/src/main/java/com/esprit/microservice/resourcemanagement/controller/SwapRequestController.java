package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateSwapRequest;
import com.esprit.microservice.resourcemanagement.dto.response.SwapRequestResponse;
import com.esprit.microservice.resourcemanagement.service.SwapRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/swaps")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    @GetMapping
    public ResponseEntity<List<SwapRequestResponse>> listOwn() {
        return ResponseEntity.ok(swapRequestService.listOwn(currentUser()));
    }

    @PostMapping
    public ResponseEntity<SwapRequestResponse> requestSwap(
            @Valid @RequestBody CreateSwapRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(swapRequestService.requestSwap(req, currentUser()));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<SwapRequestResponse> accept(@PathVariable UUID id) {
        return ResponseEntity.ok(swapRequestService.acceptSwap(id, currentUser()));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<SwapRequestResponse> reject(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String note = body != null ? body.get("note") : null;
        return ResponseEntity.ok(swapRequestService.rejectSwap(id, note, currentUser()));
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
