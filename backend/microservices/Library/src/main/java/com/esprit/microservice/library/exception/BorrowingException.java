package com.esprit.microservice.library.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class BorrowingException extends RuntimeException {

    public BorrowingException(String message) {
        super(message);
    }
}
