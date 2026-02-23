package com.example.offer.analytics;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OfferHistoryRepository
        extends MongoRepository<OfferHistory, String> {
}