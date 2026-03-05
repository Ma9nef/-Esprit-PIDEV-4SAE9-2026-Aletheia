package com.example.offer.analytics;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfferHistoryRepository extends MongoRepository<OfferHistory, String> {
}