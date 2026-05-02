package com.esprit.microservice.resourcemanagement.exception;

public class ResourceUnderMaintenanceException extends RuntimeException {
    public ResourceUnderMaintenanceException(String message) {
        super(message);
    }
}
