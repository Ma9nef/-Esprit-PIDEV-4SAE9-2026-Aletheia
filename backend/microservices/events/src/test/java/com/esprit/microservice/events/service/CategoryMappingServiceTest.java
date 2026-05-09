package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.repository.EventCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class CategoryMappingServiceTest {

    @Mock
    private EventCategoryRepository categoryRepository;

    @InjectMocks
    private CategoryMappingService categoryMappingService;

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setTitle("Spring Conference 2026");
        event.setDescription("A great conference about Spring Boot");
        event.setLocation("Paris");
    }

    @Test
    void extractCategoryFromEvent_ShouldReturnDefault() {
        String category = categoryMappingService.extractCategoryFromEvent(event);
        assertThat(category).isEqualTo("Conference");
    }

    @Test
    void addKeywordMapping_ShouldNotThrowException() {
        categoryMappingService.addKeywordMapping("test", "TestCategory");
        assertThat(true).isTrue();
    }
}
