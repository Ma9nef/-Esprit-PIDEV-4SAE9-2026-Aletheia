package com.esprit.microservice.library.repository;

import com.esprit.microservice.library.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserIdAndCheckedOutFalse(Long userId);
}