package com.esprit.microservice.library.service;



import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.exception.ProductNotFoundException;
import com.esprit.microservice.library.mapper.ProductMapper;
import com.esprit.microservice.library.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    public static final Long userId = 1L;


    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }


    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAll(ProductType type, Boolean available, String search) {

        List<Product> products;

        if (search != null && !search.isBlank()) {
            // Search by title or author takes priority
            products = productRepository
                    .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(search, search);

        } else if (type != null && available != null) {
            products = productRepository.findByTypeAndAvailable(type, available);

        } else if (type != null) {
            products = productRepository.findByType(type);

        } else if (available != null) {
            products = productRepository.findByAvailable(available);

        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public ProductDTO getById(Long id) {
        Product product = findOrThrow(id);
        return productMapper.toDTO(product);
    }

    // ─── CREATE ──────────────────────────────────────────────────────────────────

    @Override
    public ProductDTO create(ProductDTO dto) {
        // Optional: prevent duplicate titles
        if (productRepository.existsByTitleIgnoreCase(dto.getTitle())) {
            throw new IllegalArgumentException(
                    "A product with the title '" + dto.getTitle() + "' already exists.");
        }

        Product product = productMapper.toEntity(dto);
        Product saved = productRepository.save(product);
        return productMapper.toDTO(saved);
    }

    // ─── UPDATE ──────────────────────────────────────────────────────────────────

    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        Product existing = findOrThrow(id);

        // If the title changed, check for duplicates
        boolean titleChanged = !existing.getTitle().equalsIgnoreCase(dto.getTitle());
        if (titleChanged && productRepository.existsByTitleIgnoreCase(dto.getTitle())) {
            throw new IllegalArgumentException(
                    "A product with the title '" + dto.getTitle() + "' already exists.");
        }

        productMapper.updateEntityFromDTO(dto, existing);
        Product updated = productRepository.save(existing);
        return productMapper.toDTO(updated);
    }

    // ─── DELETE ──────────────────────────────────────────────────────────────────

    @Override
    public void delete(Long id) {
        Product product = findOrThrow(id);
        productRepository.delete(product);
    }

    // ─── PRIVATE HELPERS ─────────────────────────────────────────────────────────

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product with id " + id + " not found."));
    }
}
