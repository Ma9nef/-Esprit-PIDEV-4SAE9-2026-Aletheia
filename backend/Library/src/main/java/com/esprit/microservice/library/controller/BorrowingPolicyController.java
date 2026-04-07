package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.dto.BorrowingPolicyDTO;
import com.esprit.microservice.library.enums.UserRole;
import com.esprit.microservice.library.service.BorrowingPolicyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin API for managing borrowing policies.
 *
 * GET  /api/policies               – list all policies
 * GET  /api/policies/role/{role}   – get policy for a specific role
 * PUT  /api/policies/{id}          – update a policy
 */
@RestController
@RequestMapping("/api/policies")
@CrossOrigin(origins = "*")
public class BorrowingPolicyController {

    private final BorrowingPolicyService policyService;

    public BorrowingPolicyController(BorrowingPolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    public ResponseEntity<List<BorrowingPolicyDTO>> getAll() {
        return ResponseEntity.ok(policyService.getAllPolicies());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<BorrowingPolicyDTO> getByRole(@PathVariable UserRole role) {
        return ResponseEntity.ok(policyService.getPolicyForRole(role));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BorrowingPolicyDTO> update(@PathVariable Long id,
                                                     @Valid @RequestBody BorrowingPolicyDTO dto) {
        return ResponseEntity.ok(policyService.updatePolicy(id, dto));
    }
}
