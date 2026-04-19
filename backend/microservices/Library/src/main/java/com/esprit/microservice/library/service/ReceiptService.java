package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Receipt;

public interface ReceiptService {
    Receipt generate(Long orderId);
}
