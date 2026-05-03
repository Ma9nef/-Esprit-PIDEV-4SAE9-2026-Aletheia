package com.esprit.microservice.resourcemanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Enables Spring's scheduled task execution for:
 * - Auto-expiry of unconfirmed pending reservations
 * - Processing maintenance schedule transitions
 * - Expiring stale waitlist entries and notifications
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
