package com.esprit.microservice.library.exception;


import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Centralized exception handler for the Library microservice.
 *
 * Spring MVC 7 / Spring Boot 4 breaks all ResponseEntity-based exception handlers:
 * - HttpMediaTypeNotAcceptableException when returning Map<String,Object>
 * - HttpMessageNotWritableException even when returning String with preset Content-Type
 *
 * Fix: write directly to HttpServletResponse, bypassing MessageConverter entirely.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @Autowired
    private ObjectMapper objectMapper;

    // ─── 404 Not Found ───────────────────────────────────────────────────────────

    @ExceptionHandler(ProductNotFoundException.class)
    public void handleNotFound(ProductNotFoundException ex, HttpServletResponse response) throws IOException {
        writeError(response, HttpServletResponse.SC_NOT_FOUND, "Not Found", ex.getMessage());
    }

    // ─── 422 Borrowing policy violation ──────────────────────────────────────────

    @ExceptionHandler(BorrowingException.class)
    public void handleBorrowing(BorrowingException ex, HttpServletResponse response) throws IOException {
        writeError(response, 422, "Unprocessable Entity", ex.getMessage());
    }

    // ─── 400 Bad Request (duplicate title, etc.) ─────────────────────────────────

    @ExceptionHandler(IllegalArgumentException.class)
    public void handleBadRequest(IllegalArgumentException ex, HttpServletResponse response) throws IOException {
        writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Bad Request", ex.getMessage());
    }

    // ─── 400 Validation errors (@Valid) ──────────────────────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public void handleValidation(MethodArgumentNotValidException ex, HttpServletResponse response) throws IOException {
        String errors = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Bad Request", errors);
    }

    // ─── 500 Catch-all ───────────────────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public void handleGeneric(Exception ex, HttpServletResponse response) throws IOException {
        writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                "Internal Server Error", "An unexpected error occurred: " + ex.getMessage());
    }

    // ─── Helper ──────────────────────────────────────────────────────────────────

    private void writeError(HttpServletResponse response, int status, String error, String message)
            throws IOException {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status);
        body.put("error", error);
        body.put("message", message);

        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
