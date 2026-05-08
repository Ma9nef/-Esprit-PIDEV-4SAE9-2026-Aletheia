package com.example.offer.repository;

import com.example.offer.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CouponRepository extends MongoRepository<Coupon, String> {

    Optional<Coupon> findByCode(String code);
    // Optionnel: autres méthodes utiles
    boolean existsByCode(String code);
}
