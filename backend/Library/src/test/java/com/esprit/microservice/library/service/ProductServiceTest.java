package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.exception.ProductNotFoundException;
import com.esprit.microservice.library.mapper.ProductMapper;
import com.esprit.microservice.library.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService — Unit Tests")
class ProductServiceTest {

    @Mock private ProductRepository productRepository;
    @Mock private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        product = new Product("Spring Boot Guide", "A complete guide", "Author A",
                ProductType.PDF, 29.99, null, null, true);

        productDTO = new ProductDTO();
        productDTO.setTitle("Spring Boot Guide");
        productDTO.setType(ProductType.PDF);
        productDTO.setPrice(29.99);
        productDTO.setAvailable(true);
    }

    // ── getAll ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAll: no filters — should return all products")
    void getAll_noFilters_returnsAll() {
        when(productRepository.findAll()).thenReturn(List.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        List<ProductDTO> result = productService.getAll(null, null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Spring Boot Guide");
    }

    @Test
    @DisplayName("getAll: with type filter — should delegate to findByType")
    void getAll_withTypeFilter() {
        when(productRepository.findByType(ProductType.PDF)).thenReturn(List.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        List<ProductDTO> result = productService.getAll(ProductType.PDF, null, null);

        assertThat(result).hasSize(1);
        verify(productRepository).findByType(ProductType.PDF);
    }

    @Test
    @DisplayName("getAll: with search — should delegate to title/author search")
    void getAll_withSearch() {
        when(productRepository.findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase("Spring", "Spring"))
                .thenReturn(List.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        List<ProductDTO> result = productService.getAll(null, null, "Spring");

        assertThat(result).hasSize(1);
    }

    // ── getById ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("getById: should return DTO when product found")
    void getById_found() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.getById(1L);

        assertThat(result.getTitle()).isEqualTo("Spring Boot Guide");
    }

    @Test
    @DisplayName("getById: should throw ProductNotFoundException when not found")
    void getById_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining("99");
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("create: should save and return DTO")
    void create_success() {
        when(productRepository.existsByTitleIgnoreCase("Spring Boot Guide")).thenReturn(false);
        when(productMapper.toEntity(productDTO)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.create(productDTO);

        assertThat(result.getTitle()).isEqualTo("Spring Boot Guide");
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("create: should throw when title already exists")
    void create_duplicateTitle() {
        when(productRepository.existsByTitleIgnoreCase("Spring Boot Guide")).thenReturn(true);

        assertThatThrownBy(() -> productService.create(productDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");

        verify(productRepository, never()).save(any());
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("update: should save updated product")
    void update_success() {
        ProductDTO updatedDTO = new ProductDTO();
        updatedDTO.setTitle("Spring Boot Guide v2");
        updatedDTO.setType(ProductType.PDF);
        updatedDTO.setPrice(39.99);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.existsByTitleIgnoreCase("Spring Boot Guide v2")).thenReturn(false);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(updatedDTO);

        ProductDTO result = productService.update(1L, updatedDTO);

        assertThat(result.getTitle()).isEqualTo("Spring Boot Guide v2");
        verify(productRepository).save(product);
    }

    @Test
    @DisplayName("update: should throw when product not found")
    void update_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.update(99L, productDTO))
                .isInstanceOf(ProductNotFoundException.class);
    }

    // ── delete ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("delete: should call repository delete")
    void delete_success() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.delete(1L);

        verify(productRepository).delete(product);
    }

    @Test
    @DisplayName("delete: should throw when product not found")
    void delete_notFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.delete(99L))
                .isInstanceOf(ProductNotFoundException.class);

        verify(productRepository, never()).delete(any());
    }

    // ── getLowStockProducts ───────────────────────────────────────────────────

    @Test
    @DisplayName("getLowStockProducts: should return products below threshold")
    void getLowStockProducts_returnsLowStock() {
        Product lowStock = new Product("Low Book", "", "Author", ProductType.BOOK, 10.0, null, null, true);
        lowStock.setStockQuantity(2);
        lowStock.setStockThreshold(5);

        ProductDTO lowStockDTO = new ProductDTO();
        lowStockDTO.setTitle("Low Book");
        lowStockDTO.setLowStock(true);

        when(productRepository.findLowStockProducts()).thenReturn(List.of(lowStock));
        when(productMapper.toDTO(lowStock)).thenReturn(lowStockDTO);

        List<ProductDTO> result = productService.getLowStockProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getLowStock()).isTrue();
    }
}
