package com.esprit.microservice.courses.dto;

import java.util.List;

public record MenuCategoryDTO(
        String label,
        List<String> subCategories
) {}