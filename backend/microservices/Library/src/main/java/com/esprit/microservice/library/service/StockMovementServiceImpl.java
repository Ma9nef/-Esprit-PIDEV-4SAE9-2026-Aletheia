package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.dto.StockMovementDTO;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.entity.StockMovement;
import com.esprit.microservice.library.enums.MovementType;
import com.esprit.microservice.library.exception.ProductNotFoundException;
import com.esprit.microservice.library.mapper.ProductMapper;
import com.esprit.microservice.library.mapper.StockMovementMapper;
import com.esprit.microservice.library.repository.ProductRepository;
import com.esprit.microservice.library.repository.StockMovementRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StockMovementServiceImpl implements StockMovementService {

    private final ProductRepository productRepository;
    private final StockMovementRepository stockMovementRepository;
    private final ProductMapper productMapper;
    private final StockMovementMapper stockMovementMapper;

    public StockMovementServiceImpl(ProductRepository productRepository,
                                     StockMovementRepository stockMovementRepository,
                                     ProductMapper productMapper,
                                     StockMovementMapper stockMovementMapper) {
        this.productRepository = productRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.productMapper = productMapper;
        this.stockMovementMapper = stockMovementMapper;
    }

    @Override
    public ProductDTO addStock(Long productId, Integer quantity, String reason) {
        Product product = findProductOrThrow(productId);

        product.setStockQuantity(product.getStockQuantity() + quantity);

        // Auto-set available to true when stock is added
        if (product.getStockQuantity() > 0) {
            product.setAvailable(true);
        }

        productRepository.save(product);

        StockMovement movement = new StockMovement(product, MovementType.IN, quantity, reason);
        stockMovementRepository.save(movement);

        return productMapper.toDTO(product);
    }

    @Override
    public ProductDTO removeStock(Long productId, Integer quantity, String reason) {
        Product product = findProductOrThrow(productId);

        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException(
                    "Insufficient stock. Available: " + product.getStockQuantity() + ", Requested: " + quantity);
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);

        // Auto-set available to false when stock reaches 0
        if (product.getStockQuantity() == 0) {
            product.setAvailable(false);
        }

        productRepository.save(product);

        StockMovement movement = new StockMovement(product, MovementType.OUT, quantity, reason);
        stockMovementRepository.save(movement);

        return productMapper.toDTO(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementDTO> getMovementsByProductId(Long productId) {
        // Verify product exists
        findProductOrThrow(productId);

        return stockMovementRepository.findByProductIdOrderByTimestampDesc(productId)
                .stream()
                .map(stockMovementMapper::toDTO)
                .collect(Collectors.toList());
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product with id " + id + " not found."));
    }
}

