package com.esprit.microservice.library.service;

import com.esprit.microservice.library.client.UserServiceClient;
import com.esprit.microservice.library.dto.BorrowRequestDTO;
import com.esprit.microservice.library.dto.LoanDTO;
import com.esprit.microservice.library.dto.UserDto;
import com.esprit.microservice.library.entity.Loan;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.LoanStatus;
import com.esprit.microservice.library.exception.BorrowingException;
import com.esprit.microservice.library.exception.ProductNotFoundException;
import com.esprit.microservice.library.repository.LoanRepository;
import com.esprit.microservice.library.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepo;
    private final ProductRepository productRepo;
    private final BorrowingPolicyService policyService;
    private final StockMovementService stockMovementService;
    private final UserServiceClient userClient;

    public LoanServiceImpl(LoanRepository loanRepo,
                           ProductRepository productRepo,
                           BorrowingPolicyService policyService,
                           StockMovementService stockMovementService,
                           UserServiceClient userClient) {
        this.loanRepo = loanRepo;
        this.productRepo = productRepo;
        this.policyService = policyService;
        this.stockMovementService = stockMovementService;
        this.userClient = userClient;
    }

    // ── Borrow ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public LoanDTO borrowProduct(BorrowRequestDTO request) {
        // Resolve user and role
        UserDto user = userClient.getUserById(request.getUserId());
        String userRole = user.getRole() != null ? user.getRole() : "LEARNER";

        // Resolve product
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product not found: " + request.getProductId()));

        // Run all policy checks (throws BorrowingException on violation)
        policyService.validateBorrowRequest(request.getUserId(), userRole, product);

        // Calculate due date per policy
        LocalDate dueDate = policyService.calculateDueDate(userRole);

        // Build loan record
        Loan loan = new Loan();
        loan.setUserId(request.getUserId());
        loan.setUserRole(userRole);
        loan.setProduct(product);
        loan.setBorrowDate(LocalDate.now());
        loan.setDueDate(dueDate);
        loan.setStatus(LoanStatus.ACTIVE);

        loanRepo.save(loan);

        // Decrement physical stock (also creates StockMovement audit record)
        stockMovementService.removeStock(
                product.getId(), 1,
                "Borrowed by user " + request.getUserId() + " (loan #" + loan.getId() + ")");

        return toDTO(loan, user.getEmail());
    }

    // ── Return ────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public LoanDTO returnProduct(Long loanId, Long userId) {
        Loan loan = loanRepo.findByIdAndUserId(loanId, userId)
                .orElseThrow(() -> new BorrowingException(
                        "Loan #" + loanId + " not found for user " + userId));

        if (loan.getStatus() == LoanStatus.RETURNED) {
            throw new BorrowingException("Loan #" + loanId + " is already returned.");
        }

        LocalDate today = LocalDate.now();
        long overdueDays = Math.max(0, ChronoUnit.DAYS.between(loan.getDueDate(), today));

        // Compute fine from policy
        double fine = 0.0;
        if (overdueDays > 0) {
            try {
                com.esprit.microservice.library.dto.BorrowingPolicyDTO policy =
                        policyService.getPolicyForRole(
                                com.esprit.microservice.library.enums.UserRole.valueOf(
                                        loan.getUserRole().toUpperCase()));
                fine = overdueDays * policy.getFineRatePerDay();
            } catch (Exception ignored) {
                // Policy may have been deleted; fine stays 0
            }
        }

        loan.setReturnDate(today);
        loan.setStatus(LoanStatus.RETURNED);
        loan.setFineAmount(fine);
        loan.setFinePaid(fine == 0.0); // no fine = auto-cleared

        loanRepo.save(loan);

        // Increment physical stock
        stockMovementService.addStock(
                loan.getProduct().getId(), 1,
                "Returned by user " + userId + " (loan #" + loanId + ")");

        return toDTO(loan, null);
    }

    // ── Fine payment ──────────────────────────────────────────────────────────

    @Override
    @Transactional
    public LoanDTO payFine(Long loanId, Long userId) {
        Loan loan = loanRepo.findByIdAndUserId(loanId, userId)
                .orElseThrow(() -> new BorrowingException(
                        "Loan #" + loanId + " not found for user " + userId));

        if (loan.isFinePaid()) {
            throw new BorrowingException("Fine for loan #" + loanId + " is already paid.");
        }
        if (loan.getFineAmount() <= 0) {
            throw new BorrowingException("No outstanding fine on loan #" + loanId + ".");
        }

        loan.setFinePaid(true);
        return toDTO(loanRepo.save(loan), null);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    @Override
    public LoanDTO getLoanById(Long loanId) {
        return toDTO(loanRepo.findById(loanId)
                .orElseThrow(() -> new BorrowingException("Loan not found: " + loanId)), null);
    }

    @Override
    public List<LoanDTO> getLoansByUserId(Long userId) {
        return loanRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(l -> toDTO(l, null)).collect(Collectors.toList());
    }

    @Override
    public List<LoanDTO> getActiveLoansByUserId(Long userId) {
        return loanRepo.findActiveLoansByUserId(userId)
                .stream().map(l -> toDTO(l, null)).collect(Collectors.toList());
    }

    @Override
    public List<LoanDTO> getAllLoans() {
        return loanRepo.findAll().stream().map(l -> toDTO(l, null)).collect(Collectors.toList());
    }

    @Override
    public List<LoanDTO> getOverdueLoans() {
        return loanRepo.findByStatus(LoanStatus.OVERDUE)
                .stream().map(l -> toDTO(l, null)).collect(Collectors.toList());
    }

    // ── Scheduled overdue refresh ─────────────────────────────────────────────

    @Override
    @Transactional
    public void refreshOverdueStatus() {
        List<Loan> pastDue = loanRepo.findLoansToMarkOverdue(LocalDate.now());
        pastDue.forEach(l -> l.setStatus(LoanStatus.OVERDUE));
        loanRepo.saveAll(pastDue);
    }

    // ── Mapping ───────────────────────────────────────────────────────────────

    private LoanDTO toDTO(Loan loan, String userEmail) {
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId());
        dto.setUserId(loan.getUserId());
        dto.setUserRole(loan.getUserRole());
        dto.setProductId(loan.getProduct().getId());
        dto.setProductTitle(loan.getProduct().getTitle());
        dto.setProductAuthor(loan.getProduct().getAuthor());
        dto.setProductType(loan.getProduct().getType());
        dto.setProductCoverImageUrl(loan.getProduct().getCoverImageUrl());
        dto.setBorrowDate(loan.getBorrowDate());
        dto.setDueDate(loan.getDueDate());
        dto.setReturnDate(loan.getReturnDate());
        dto.setStatus(loan.getStatus());
        dto.setFineAmount(loan.getFineAmount());
        dto.setFinePaid(loan.isFinePaid());
        dto.setCreatedAt(loan.getCreatedAt());

        if (loan.getStatus() != LoanStatus.RETURNED && loan.getDueDate() != null) {
            long overdue = ChronoUnit.DAYS.between(loan.getDueDate(), LocalDate.now());
            dto.setDaysOverdue(Math.max(0, overdue));
        }
        return dto;
    }
}
