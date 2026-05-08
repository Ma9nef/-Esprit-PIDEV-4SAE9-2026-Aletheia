package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.BorrowingPolicy;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.enums.UserRole;
import com.esprit.microservice.library.exception.BorrowingException;
import com.esprit.microservice.library.repository.BorrowingPolicyRepository;
import com.esprit.microservice.library.repository.LoanRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BorrowingPolicyServiceImplTest {

    @Mock
    private BorrowingPolicyRepository policyRepo;
    @Mock
    private LoanRepository loanRepo;

    @InjectMocks
    private BorrowingPolicyServiceImpl service;

    private BorrowingPolicy learnerPolicy;
    private Product book;

    @BeforeEach
    void setUp() {
        learnerPolicy = new BorrowingPolicy(
                UserRole.LEARNER, 2, 14, 1.5, 10.0, Set.of(ProductType.EXAM)
        );

        book = new Product();
        book.setTitle("Clean Code");
        book.setType(ProductType.BOOK);
        book.setStockQuantity(3);
    }

    @Test
    void validateBorrowRequest_shouldBlockRestrictedType() {
        Product exam = new Product();
        exam.setType(ProductType.EXAM);
        exam.setTitle("Final Exam");
        exam.setStockQuantity(1);
        when(policyRepo.findByUserRole(UserRole.LEARNER)).thenReturn(java.util.Optional.of(learnerPolicy));

        assertThrows(BorrowingException.class, () -> service.validateBorrowRequest(1L, "LEARNER", exam));
    }

    @Test
    void validateBorrowRequest_shouldBlockOutOfStock() {
        book.setStockQuantity(0);
        when(policyRepo.findByUserRole(UserRole.LEARNER)).thenReturn(java.util.Optional.of(learnerPolicy));

        assertThrows(BorrowingException.class, () -> service.validateBorrowRequest(1L, "LEARNER", book));
    }

    @Test
    void validateBorrowRequest_shouldBlockWhenQuotaReached() {
        when(policyRepo.findByUserRole(UserRole.LEARNER)).thenReturn(java.util.Optional.of(learnerPolicy));
        when(loanRepo.countActiveLoansByUserId(1L)).thenReturn(2L);

        assertThrows(BorrowingException.class, () -> service.validateBorrowRequest(1L, "LEARNER", book));
    }

    @Test
    void calculateDueDate_shouldFallbackUnknownRoleToLearner() {
        when(policyRepo.findByUserRole(UserRole.LEARNER)).thenReturn(java.util.Optional.of(learnerPolicy));

        LocalDate dueDate = service.calculateDueDate("role_unknown");

        assertEquals(LocalDate.now().plusDays(14), dueDate);
        verify(policyRepo).findByUserRole(UserRole.LEARNER);
    }
}

