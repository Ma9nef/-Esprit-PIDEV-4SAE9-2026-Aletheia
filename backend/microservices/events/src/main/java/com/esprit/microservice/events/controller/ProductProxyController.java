package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.ProductDTO;
import com.esprit.microservice.events.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events/products")
@RequiredArgsConstructor
public class ProductProxyController {

    private final ProductService productService;

    // Endpoint pour tester l'appel Feign
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("✅ Product Feign Client is working!");
    }

    // Récupérer tous les produits
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Récupérer un produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    // Récupérer les produits par type
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable String type) {
        List<ProductDTO> products = productService.getProductsByType(type);
        return ResponseEntity.ok(products);
    }

    // Vérifier disponibilité
    @GetMapping("/{id}/available")
    public ResponseEntity<Boolean> isAvailable(@PathVariable Long id) {
        Boolean available = productService.isProductAvailable(id);
        return ResponseEntity.ok(available);
    }

    // Créer un produit (proxy)
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO product) {
        ProductDTO created = productService.createProduct(product);
        return ResponseEntity.ok(created);
    }
}