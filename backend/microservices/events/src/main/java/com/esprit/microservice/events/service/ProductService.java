package com.esprit.microservice.events.service;

import com.esprit.microservice.events.client.ProductFeignClient;
import com.esprit.microservice.events.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductFeignClient productFeignClient;

    // Récupérer et afficher tous les produits
    public List<ProductDTO> getAllProducts() {
        log.info("📦 Appel Feign Client: récupération de tous les produits");
        try {
            List<ProductDTO> products = productFeignClient.getAllProducts();
            log.info("✅ {} produits récupérés avec succès", products.size());

            // Afficher les détails dans les logs
            products.forEach(product -> {
                log.info("📚 Produit: {} - Auteur: {} - Prix: {}€",
                        product.getTitle(),
                        product.getAuthor(),
                        product.getPrice()
                );
            });

            return products;
        } catch (Exception e) {
            log.error("❌ Erreur lors de l'appel Feign: {}", e.getMessage());
            throw new RuntimeException("Impossible de récupérer les produits", e);
        }
    }

    // Récupérer un produit par ID
    public ProductDTO getProductById(Long id) {
        log.info("📦 Appel Feign Client: récupération du produit ID: {}", id);
        try {
            ProductDTO product = productFeignClient.getProductById(id);
            log.info("✅ Produit trouvé: {} - {}", product.getTitle(), product.getAuthor());
            return product;
        } catch (Exception e) {
            log.error("❌ Produit non trouvé ID: {}", id);
            return null;
        }
    }

    // Récupérer les produits par type
    public List<ProductDTO> getProductsByType(String type) {
        log.info("📦 Appel Feign Client: produits de type: {}", type);
        return productFeignClient.getProductsByType(type);
    }

    // Vérifier la disponibilité
    public Boolean isProductAvailable(Long id) {
        log.info("🔍 Vérification disponibilité produit ID: {}", id);
        return productFeignClient.isProductAvailable(id);
    }

    // Créer un produit (via l'API)
    public ProductDTO createProduct(ProductDTO product) {
        log.info("➕ Création d'un nouveau produit: {}", product.getTitle());
        return productFeignClient.createProduct(product);
    }
}