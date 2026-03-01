package com.esprit.microservice.library.dto;

import com.esprit.microservice.library.enums.ProductType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class ProductDTO {

    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private String author;

    @NotNull(message = "Product type is required")
    private ProductType type;

    @Min(value = 0, message = "Price must be 0 or greater")
    private Double price = 0.0;

    private String fileUrl;

    private String coverImageUrl;

    private Boolean available = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public ProductDTO() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public ProductType getType() { return type; }
    public void setType(ProductType type) { this.type = type; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
