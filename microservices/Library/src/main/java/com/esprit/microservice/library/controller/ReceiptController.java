package com.esprit.microservice.library.controller;



import com.esprit.microservice.library.entity.Receipt;
import com.esprit.microservice.library.service.ReceiptService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    private final ReceiptService receiptService;
    public static final Long userId = 1L;


    public ReceiptController(ReceiptService receiptService) {
        this.receiptService = receiptService;
    }

    @PostMapping("/{orderId}")
    public Receipt generate(@PathVariable Long orderId) {
        return receiptService.generate(orderId);
    }
}
