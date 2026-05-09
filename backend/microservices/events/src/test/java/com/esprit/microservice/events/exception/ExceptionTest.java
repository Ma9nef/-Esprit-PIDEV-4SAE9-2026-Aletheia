package com.esprit.microservice.events.exception;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ExceptionTest {

    @Test
    void resourceNotFoundException_ShouldCreateWithMessage() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Resource not found");
        assertThat(ex.getMessage()).isEqualTo("Resource not found");
    }

    @Test
    void resourceUnavailableException_ShouldCreateWithMessage() {
        ResourceUnavailableException ex = new ResourceUnavailableException("Resource unavailable");
        assertThat(ex.getMessage()).isEqualTo("Resource unavailable");
    }

    @Test
    void userNotFoundException_ShouldCreateWithMessage() {
        UserNotFoundException ex = new UserNotFoundException("User not found");
        assertThat(ex.getMessage()).isEqualTo("User not found");
    }

    @Test
    void userServiceException_ShouldCreateWithMessage() {
        UserServiceException ex = new UserServiceException("User service error");
        assertThat(ex.getMessage()).isEqualTo("User service error");
    }
}
