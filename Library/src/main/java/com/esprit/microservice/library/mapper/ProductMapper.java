package com.esprit.microservice.library.mapper;


import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    /**
     * Converts a Product entity to a ProductDTO.
     */
    public ProductDTO toDTO(Product product) {
        if (product == null) return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setAuthor(product.getAuthor());
        dto.setType(product.getType());
        dto.setPrice(product.getPrice());
        dto.setFileUrl(product.getFileUrl());
        dto.setCoverImageUrl(product.getCoverImageUrl());
        dto.setAvailable(product.getAvailable());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        return dto;
    }

    /**
     * Converts a ProductDTO to a Product entity.
     * Does NOT set id, createdAt, updatedAt — these are managed by JPA.
     */
    public Product toEntity(ProductDTO dto) {
        if (dto == null) return null;

        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setAuthor(dto.getAuthor());
        product.setType(dto.getType());
        product.setPrice(dto.getPrice() != null ? dto.getPrice() : 0.0);
        product.setFileUrl(dto.getFileUrl());
        product.setCoverImageUrl(dto.getCoverImageUrl());
        product.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);

        return product;
    }

    /**
     * Updates an existing Product entity from a ProductDTO.
     * Useful for PUT operations — keeps the same entity instance tracked by JPA.
     */
    public void updateEntityFromDTO(ProductDTO dto, Product product) {
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setAuthor(dto.getAuthor());
        product.setType(dto.getType());
        product.setPrice(dto.getPrice() != null ? dto.getPrice() : 0.0);
        product.setFileUrl(dto.getFileUrl());
        product.setCoverImageUrl(dto.getCoverImageUrl());
        product.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);
    }
}
