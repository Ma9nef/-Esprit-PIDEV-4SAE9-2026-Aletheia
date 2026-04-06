package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
@DisplayName("ProductController — Integration Tests")
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    private ProductDTO buildDTO(Long id, String title, ProductType type, double price) {
        ProductDTO dto = new ProductDTO();
        dto.setId(id);
        dto.setTitle(title);
        dto.setType(type);
        dto.setPrice(price);
        dto.setAvailable(true);
        return dto;
    }

    // ── GET /api/products — public ────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/products: should return 200 without authentication")
    void getAllProducts_public_returns200() throws Exception {
        when(productService.getAll(null, null, null))
                .thenReturn(List.of(buildDTO(1L, "Spring Boot Guide", ProductType.PDF, 29.99)));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Spring Boot Guide"))
                .andExpect(jsonPath("$[0].type").value("PDF"));
    }

    @Test
    @DisplayName("GET /api/products/{id}: should return 200 without authentication")
    void getProductById_public_returns200() throws Exception {
        when(productService.getById(1L))
                .thenReturn(buildDTO(1L, "Angular Guide", ProductType.PDF, 19.99));

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Angular Guide"));
    }

    // ── POST /api/products — ADMIN only ───────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/products: ADMIN should create product and return 201")
    void createProduct_admin_returns201() throws Exception {
        ProductDTO request = buildDTO(null, "New Book", ProductType.BOOK, 34.99);
        ProductDTO created = buildDTO(5L, "New Book", ProductType.BOOK, 34.99);

        when(productService.create(any(ProductDTO.class))).thenReturn(created);

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.title").value("New Book"));
    }

    @Test
    @DisplayName("POST /api/products: unauthenticated should return 401")
    void createProduct_unauthenticated_returns401() throws Exception {
        ProductDTO request = buildDTO(null, "New Book", ProductType.BOOK, 34.99);

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    @DisplayName("POST /api/products: LEARNER should be forbidden (403)")
    void createProduct_learner_returns403() throws Exception {
        ProductDTO request = buildDTO(null, "New Book", ProductType.BOOK, 34.99);

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    // ── PUT /api/products/{id} — ADMIN only ───────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("PUT /api/products/{id}: ADMIN should update and return 200")
    void updateProduct_admin_returns200() throws Exception {
        ProductDTO update = buildDTO(1L, "Updated Title", ProductType.PDF, 39.99);

        when(productService.update(eq(1L), any(ProductDTO.class))).thenReturn(update);

        mockMvc.perform(put("/api/products/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    @DisplayName("PUT /api/products/{id}: INSTRUCTOR should be forbidden (403)")
    void updateProduct_instructor_returns403() throws Exception {
        ProductDTO update = buildDTO(1L, "Updated Title", ProductType.PDF, 39.99);

        mockMvc.perform(put("/api/products/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isForbidden());
    }

    // ── DELETE /api/products/{id} — ADMIN only ────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/products/{id}: ADMIN should return 204")
    void deleteProduct_admin_returns204() throws Exception {
        mockMvc.perform(delete("/api/products/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/products/{id}: unauthenticated should return 401")
    void deleteProduct_unauthenticated_returns401() throws Exception {
        mockMvc.perform(delete("/api/products/1").with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    // ── Validation ────────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/products: missing title should return 400")
    void createProduct_missingTitle_returns400() throws Exception {
        ProductDTO invalid = new ProductDTO();
        invalid.setType(ProductType.PDF); // no title

        mockMvc.perform(post("/api/products")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());
    }
}
