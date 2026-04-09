package com.esprit.microservice.resourcemanagement.exception;

import java.util.UUID;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(UUID id) {
        super("Resource not found with id: " + id);
    }
}
