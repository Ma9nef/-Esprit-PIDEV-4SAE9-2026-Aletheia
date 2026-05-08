package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventCategory;
import com.esprit.microservice.events.repository.EventCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryMappingService {

    private final EventCategoryRepository categoryRepository;

    // Map des mots-clés vers catégories
    private static final Map<String, String> KEYWORD_TO_CATEGORY = new HashMap<>();

    @PostConstruct
    public void init() {
        // Initialiser les mappings par défaut
        KEYWORD_TO_CATEGORY.put("concert", "Concert");
        KEYWORD_TO_CATEGORY.put("music", "Concert");
        KEYWORD_TO_CATEGORY.put("sport", "Sport");
        KEYWORD_TO_CATEGORY.put("match", "Sport");
        KEYWORD_TO_CATEGORY.put("workshop", "Workshop");
        KEYWORD_TO_CATEGORY.put("formation", "Workshop");
        KEYWORD_TO_CATEGORY.put("conference", "Conference");
        KEYWORD_TO_CATEGORY.put("seminar", "Conference");
        KEYWORD_TO_CATEGORY.put("hackathon", "Hackathon");
        KEYWORD_TO_CATEGORY.put("networking", "Networking");
        KEYWORD_TO_CATEGORY.put("online", "Online");
        KEYWORD_TO_CATEGORY.put("zoom", "Online");
        KEYWORD_TO_CATEGORY.put("webinar", "Online");

        log.info("Category mapping service initialized with {} keywords", KEYWORD_TO_CATEGORY.size());
    }

    /**
     * Extraire la catégorie depuis le titre de l'événement
     */
    public String extractCategoryFromEvent(Event event) {
        String title = event.getTitle() != null ? event.getTitle().toLowerCase() : "";
        String description = event.getDescription() != null ? event.getDescription().toLowerCase() : "";
        String location = event.getLocation() != null ? event.getLocation().toLowerCase() : "";

        // Recherche par mots-clés dans le titre
        for (Map.Entry<String, String> entry : KEYWORD_TO_CATEGORY.entrySet()) {
            if (title.contains(entry.getKey()) || description.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Par localisation
        if (location.contains("online")) {
            return "Online";
        }

        // Vérifier en base de données
        if (categoryRepository.count() > 0) {
            EventCategory defaultCategory = categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                    .stream().findFirst().orElse(null);
            if (defaultCategory != null) {
                return defaultCategory.getName();
            }
        }

        return "Conference"; // Valeur par défaut
    }

    /**
     * Ajouter un nouveau mapping
     */
    public void addKeywordMapping(String keyword, String category) {
        KEYWORD_TO_CATEGORY.put(keyword.toLowerCase(), category);
        log.info("Added keyword mapping: {} -> {}", keyword, category);
    }
}