package com.esprit.microservice.library.service;


import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.enums.ProductType;;

import java.util.List;

public interface ProductService {

    List<ProductDTO> getAll(ProductType type, Boolean available, String search);

    ProductDTO getById(Long id);

    ProductDTO create(ProductDTO dto);

    ProductDTO update(Long id, ProductDTO dto);

    void delete(Long id);

    List<ProductDTO> getLowStockProducts();
}