package com.esprit.microservice.library.config;

import com.esprit.microservice.library.service.LoanService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * Enables Spring's scheduling support and registers recurring tasks.
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {

    private final LoanService loanService;

    public SchedulingConfig(LoanService loanService) {
        this.loanService = loanService;
    }

    /**
     * Runs every day at 01:00 AM.
     * Marks all ACTIVE loans whose due date has passed as OVERDUE.
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void refreshOverdueLoans() {
        loanService.refreshOverdueStatus();
    }
}
