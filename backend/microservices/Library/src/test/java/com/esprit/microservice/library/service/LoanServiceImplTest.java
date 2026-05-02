package com.esprit.microservice.library.service;

import com.esprit.microservice.library.client.NotificationServiceClient;
import com.esprit.microservice.library.client.UserServiceClient;
import com.esprit.microservice.library.dto.BorrowRequestDTO;
import com.esprit.microservice.library.dto.BorrowingPolicyDTO;
import com.esprit.microservice.library.dto.NotificationRequest;
import com.esprit.microservice.library.dto.UserDto;
import com.esprit.microservice.library.entity.Loan;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.LoanStatus;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.enums.UserRole;
import com.esprit.microservice.library.exception.BorrowingException;
import com.esprit.microservice.library.repository.LoanRepository;
import com.esprit.microservice.library.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LoanServiceImplTest {

    @Mock private LoanRepository loanRepo;
    @Mock private ProductRepository productRepo;
    @Mock private BorrowingPolicyService policyService;
    @Mock private StockMovementService stockMovementService;
    @Mock private UserServiceClient userClient;
    @Mock private NotificationServiceClient notificationClient;

    @InjectMocks
    private LoanServiceImpl service;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
        ReflectionTestUtils.setField(product, "id", 10L);
        product.setTitle("Domain-Driven Design");
        product.setAuthor("Eric Evans");
        product.setType(ProductType.BOOK);
        product.setStockQuantity(2);
    }

    @Test
    void borrowProduct_shouldCreateActiveLoanAndDecreaseStock() {
        BorrowRequestDTO request = new BorrowRequestDTO();
        request.setUserId(1L);
        request.setProductId(10L);

        UserDto user = new UserDto();
        user.setId(1L);
        user.setEmail("learner@test.com");
        user.setRole("LEARNER");

        when(userClient.getUserById(1L)).thenReturn(user);
        when(productRepo.findById(10L)).thenReturn(Optional.of(product));
        when(policyService.calculateDueDate("LEARNER")).thenReturn(LocalDate.now().plusDays(7));
        when(loanRepo.save(any(Loan.class))).thenAnswer(invocation -> {
            Loan loan = invocation.getArgument(0);
            ReflectionTestUtils.setField(loan, "id", 99L);
            return loan;
        });

        var dto = service.borrowProduct(request);

        assertEquals(LoanStatus.ACTIVE, dto.getStatus());
        assertEquals(1L, dto.getUserId());
        assertEquals(10L, dto.getProductId());
        verify(stockMovementService).removeStock(eq(10L), eq(1), any(String.class));
    }

    @Test
    void returnProduct_shouldApplyFineWhenOverdue() {
        Loan loan = new Loan();
        ReflectionTestUtils.setField(loan, "id", 77L);
        loan.setUserId(5L);
        loan.setUserRole("LEARNER");
        loan.setProduct(product);
        loan.setStatus(LoanStatus.ACTIVE);
        loan.setBorrowDate(LocalDate.now().minusDays(15));
        loan.setDueDate(LocalDate.now().minusDays(2));

        BorrowingPolicyDTO policy = new BorrowingPolicyDTO();
        policy.setUserRole(UserRole.LEARNER);
        policy.setFineRatePerDay(2.0);

        when(loanRepo.findByIdAndUserId(77L, 5L)).thenReturn(Optional.of(loan));
        when(policyService.getPolicyForRole(UserRole.LEARNER)).thenReturn(policy);
        when(loanRepo.save(any(Loan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var dto = service.returnProduct(77L, 5L);

        assertEquals(LoanStatus.RETURNED, dto.getStatus());
        assertEquals(4.0, dto.getFineAmount(), 0.0001);
        assertTrue(!dto.isFinePaid());
        verify(stockMovementService).addStock(eq(10L), eq(1), any(String.class));
    }

    @Test
    void payFine_shouldFailWhenNoOutstandingFine() {
        Loan loan = new Loan();
        loan.setFinePaid(false);
        loan.setFineAmount(0.0);

        when(loanRepo.findByIdAndUserId(4L, 9L)).thenReturn(Optional.of(loan));

        assertThrows(BorrowingException.class, () -> service.payFine(4L, 9L));
    }

    @Test
    void sendDeadlineReminders_shouldNormalizeRoleAndSendNotification() {
        Loan dueSoon = new Loan();
        dueSoon.setUserId(11L);
        dueSoon.setUserRole("ROLE_ADMIN");
        dueSoon.setStatus(LoanStatus.ACTIVE);
        dueSoon.setDueDate(LocalDate.now().plusDays(1));
        dueSoon.setProduct(product);

        when(loanRepo.findActiveLoansDueOn(LocalDate.now().plusDays(1))).thenReturn(List.of(dueSoon));

        service.sendDeadlineReminders();

        ArgumentCaptor<NotificationRequest> captor = ArgumentCaptor.forClass(NotificationRequest.class);
        verify(notificationClient).send(captor.capture());
        assertEquals("ADMIN", captor.getValue().getRecipientRole());
        verify(loanRepo, never()).save(any());
    }
}

