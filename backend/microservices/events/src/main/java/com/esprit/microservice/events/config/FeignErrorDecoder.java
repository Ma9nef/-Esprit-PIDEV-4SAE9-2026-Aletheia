package com.esprit.microservice.events.config;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FeignErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {
        log.error("Error calling {}: status={}, reason={}",
                methodKey, response.status(), response.reason());

        switch (response.status()) {
            case 404:
                return new RuntimeException("User not found");
            case 401:
                return new RuntimeException("Unauthorized access to user service");
            case 403:
                return new RuntimeException("Forbidden access to user service");
            case 500:
                return new RuntimeException("User service internal error");
            default:
                return new RuntimeException("Error calling user service: " + response.reason());
        }
    }
}