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

    // Constantes ajoutées
    private static final String CATEGORY_CONFERENCE = "Conference";
    private static final String CATEGORY_ONLINE = "Online";

    private static final Map<String, String> KEYWORD_TO_CATEGORY = new HashMap<>();

    @PostConstruct
    public void init() {
        KEYWORD_TO_CATEGORY.put("concert", "Concert");
        KEYWORD_TO_CATEGORY.put("music", "Concert");
        KEYWORD_TO_CATEGORY.put("sport", "Sport");
        KEYWORD_TO_CATEGORY.put("match", "Sport");
        KEYWORD_TO_CATEGORY.put("workshop", "Workshop");
        KEYWORD_TO_CATEGORY.put("formation", "Workshop");
        KEYWORD_TO_CATEGORY.put("conference", CATEGORY_CONFERENCE);
        KEYWORD_TO_CATEGORY.put("seminar", CATEGORY_CONFERENCE);
        KEYWORD_TO_CATEGORY.put("hackathon", "Hackathon");
        KEYWORD_TO_CATEGORY.put("networking", "Networking");
        KEYWORD_TO_CATEGORY.put("online", CATEGORY_ONLINE);
        KEYWORD_TO_CATEGORY.put("zoom", CATEGORY_ONLINE);
        KEYWORD_TO_CATEGORY.put("webinar", CATEGORY_ONLINE);

        log.info("Category mapping service initialized with {} keywords", KEYWORD_TO_CATEGORY.size());
    }

    public String extractCategoryFromEvent(Event event) {
        String title = event.getTitle() != null ? event.getTitle().toLowerCase() : "";
        String description = event.getDescription() != null ? event.getDescription().toLowerCase() : "";
        String location = event.getLocation() != null ? event.getLocation().toLowerCase() : "";

        for (Map.Entry<String, String> entry : KEYWORD_TO_CATEGORY.entrySet()) {
            if (title.contains(entry.getKey()) || description.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        if (location.contains("online")) {
            return CATEGORY_ONLINE;
        }

        if (categoryRepository.count() > 0) {
            EventCategory defaultCategory = categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                    .stream().findFirst().orElse(null);
            if (defaultCategory != null) {
                return defaultCategory.getName();
            }
        }

        return CATEGORY_CONFERENCE;
    }

    public void addKeywordMapping(String keyword, String category) {
        KEYWORD_TO_CATEGORY.put(keyword.toLowerCase(), category);
        log.info("Added keyword mapping: {} -> {}", keyword, category);
    }
}