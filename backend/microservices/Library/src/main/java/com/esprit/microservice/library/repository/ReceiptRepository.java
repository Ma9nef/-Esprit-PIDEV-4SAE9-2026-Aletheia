package com.esprit.microservice.library.repository;

import com.esprit.microservice.library.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceiptRepository extends JpaRepository<Receipt, Long> {}
