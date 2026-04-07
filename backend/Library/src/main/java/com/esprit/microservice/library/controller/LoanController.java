package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.dto.BorrowRequestDTO;
import com.esprit.microservice.library.dto.LoanDTO;
import com.esprit.microservice.library.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API for the physical borrowing workflow.
 *
 * POST  /api/loans/borrow               – borrow a product
 * POST  /api/loans/{id}/return          – return a borrowed item
 * POST  /api/loans/{id}/pay-fine        – pay overdue fine
 * GET   /api/loans/{id}                 – get loan details
 * GET   /api/loans/user/{userId}        – all loans for a user
 * GET   /api/loans/user/{userId}/active – active/overdue loans for a user
 * GET   /api/loans                      – all loans (admin)
 * GET   /api/loans/overdue              – all overdue loans (admin)
 */
@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "*")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @PostMapping("/borrow")
    public ResponseEntity<LoanDTO> borrow(@Valid @RequestBody BorrowRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.borrowProduct(request));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<LoanDTO> returnItem(@PathVariable Long id,
                                              @RequestParam Long userId) {
        return ResponseEntity.ok(loanService.returnProduct(id, userId));
    }

    @PostMapping("/{id}/pay-fine")
    public ResponseEntity<LoanDTO> payFine(@PathVariable Long id,
                                           @RequestParam Long userId) {
        return ResponseEntity.ok(loanService.payFine(id, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.getLoanById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(loanService.getLoansByUserId(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<LoanDTO>> getActiveByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(loanService.getActiveLoansByUserId(userId));
    }

    @GetMapping
    public ResponseEntity<List<LoanDTO>> getAll() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<LoanDTO>> getOverdue() {
        return ResponseEntity.ok(loanService.getOverdueLoans());
    }
}
