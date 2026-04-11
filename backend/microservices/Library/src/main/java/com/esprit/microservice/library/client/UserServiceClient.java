package com.esprit.microservice.library.client;

import com.esprit.microservice.library.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for the User microservice.
 * Used to validate that a user exists and is active before processing an order checkout.
 */
@FeignClient(name = "ALETHEIA-PLATFORM", path = "/api/users")
public interface UserServiceClient {

    @GetMapping("/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
}
