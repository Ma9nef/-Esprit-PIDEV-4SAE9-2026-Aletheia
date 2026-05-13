package com.esprit.microservice.events.client;

import com.esprit.microservice.events.dto.ProductDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(
        name = "product-service",           // Nom du service (pour Eureka)
        url = "http://localhost:8089"       // URL directe (sans Eureka)
        // Si vous utilisez Eureka, commentez url et décommentez:
        // url = "${product.service.url:http://localhost:8089}"
)
public interface ProductFeignClient {

    // Récupérer tous les produits
    @GetMapping("/api/products")
    List<ProductDTO> getAllProducts();

    // Récupérer un produit par ID
    @GetMapping("/api/products/{id}")
    ProductDTO getProductById(@PathVariable("id") Long id);

    // Récupérer les produits par type
    @GetMapping("/api/products/type/{type}")
    List<ProductDTO> getProductsByType(@PathVariable("type") String type);

    // Vérifier si un produit est disponible
    @GetMapping("/api/products/{id}/available")
    Boolean isProductAvailable(@PathVariable("id") Long id);

    // Créer un produit (si besoin)
    @PostMapping("/api/products")
    ProductDTO createProduct(@RequestBody ProductDTO product);

    // Mettre à jour un produit
    @PutMapping("/api/products/{id}")
    ProductDTO updateProduct(@PathVariable("id") Long id, @RequestBody ProductDTO product);

    // Supprimer un produit
    @DeleteMapping("/api/products/{id}")
    void deleteProduct(@PathVariable("id") Long id);
}