package com.esprit.microservice.resourcemanagement.exception;

import java.util.UUID;

public class ReservationNotFoundException extends RuntimeException {

    public ReservationNotFoundException(String message) {
        super(message);
    }

    public ReservationNotFoundException(UUID id) {
        super("Reservation not found with id: " + id);
    }
}
