package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.BorrowRequestDTO;
import com.esprit.microservice.library.dto.LoanDTO;

import java.util.List;

public interface LoanService {

    /** Borrow a product. Enforces policy rules and decrements stock. */
    LoanDTO borrowProduct(BorrowRequestDTO request);

    /** Return a borrowed item. Computes overdue fine if applicable. */
    LoanDTO returnProduct(Long loanId, Long userId);

    /** Mark an existing fine as paid. */
    LoanDTO payFine(Long loanId, Long userId);

    LoanDTO getLoanById(Long loanId);

    List<LoanDTO> getLoansByUserId(Long userId);

    List<LoanDTO> getActiveLoansByUserId(Long userId);

    List<LoanDTO> getAllLoans();

    List<LoanDTO> getOverdueLoans();

    /** Called by the daily scheduler to flip ACTIVE → OVERDUE for past-due loans. */
    void refreshOverdueStatus();

    /** Called by the daily scheduler to notify users whose loan is due tomorrow. */
    void sendDeadlineReminders();
}
