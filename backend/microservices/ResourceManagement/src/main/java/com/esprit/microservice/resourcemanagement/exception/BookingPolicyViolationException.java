package com.esprit.microservice.resourcemanagement.exception;

public class BookingPolicyViolationException extends RuntimeException {
    public BookingPolicyViolationException(String message) {
        super(message);
    }
}
