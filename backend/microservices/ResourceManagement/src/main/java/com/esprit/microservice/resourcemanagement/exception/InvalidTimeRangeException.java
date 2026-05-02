package com.esprit.microservice.resourcemanagement.exception;

public class InvalidTimeRangeException extends RuntimeException {

    public InvalidTimeRangeException(String message) {
        super(message);
    }

    public InvalidTimeRangeException() {
        super("End time must be after start time");
    }
}
