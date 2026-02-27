package com.esprit.microservice.library.repository;


import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // ─── Filter by type ─────────────────────────────────────────────────────────

    List<Product> findByType(ProductType type);

    // ─── Filter by availability ─────────────────────────────────────────────────

    List<Product> findByAvailable(Boolean available);

    // ─── Filter by type AND availability ────────────────────────────────────────

    List<Product> findByTypeAndAvailable(ProductType type, Boolean available);

    // ─── Search by title or author (case-insensitive) ────────────────────────────

    List<Product> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
            String title, String author);

    // ─── Free products (price = 0) ───────────────────────────────────────────────

    List<Product> findByPrice(Double price);

    // ─── Products within a price range ──────────────────────────────────────────

    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") Double min, @Param("max") Double max);

    // ─── Exists check (useful for validation) ───────────────────────────────────

    boolean existsByTitleIgnoreCase(String title);
}