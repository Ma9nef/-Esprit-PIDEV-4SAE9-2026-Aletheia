package com.esprit.microservice.events.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class EntityTest {

    @Test
    void event_ShouldSetAndGetFields() {
        Event event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");
        event.setDescription("Description");
        event.setLocation("Paris");
        event.setStatus(EventStatus.PLANNED);
        event.setExpectedAttendees(100);
        
        assertThat(event.getId()).isEqualTo(1L);
        assertThat(event.getTitle()).isEqualTo("Test Event");
        assertThat(event.getStatus()).isEqualTo(EventStatus.PLANNED);
    }

    @Test
    void resource_ShouldSetAndGetFields() {
        Resource resource = new Resource();
        resource.setId(1L);
        resource.setName("Projector");
        resource.setType(ResourceType.EQUIPMENT);
        resource.setTotalQuantity(5);
        resource.setReusable(true);
        
        assertThat(resource.getId()).isEqualTo(1L);
        assertThat(resource.getName()).isEqualTo("Projector");
        assertThat(resource.getType()).isEqualTo(ResourceType.EQUIPMENT);
    }

    @Test
    void eventCategory_ShouldSetAndGetFields() {
        EventCategory category = new EventCategory();
        category.setId(1L);
        category.setName("Conference");
        category.setActive(true);
        category.setDisplayOrder(1);
        
        assertThat(category.getId()).isEqualTo(1L);
        assertThat(category.getName()).isEqualTo("Conference");
        assertThat(category.getActive()).isTrue();
    }

    @Test
    void commentSentiment_ShouldSetAndGetFields() {
        CommentSentiment sentiment = new CommentSentiment();
        sentiment.setId(1L);
        sentiment.setComment("Great event!");
        sentiment.setSentiment("POSITIVE");
        sentiment.setConfidence(0.95);
        
        assertThat(sentiment.getId()).isEqualTo(1L);
        assertThat(sentiment.getComment()).isEqualTo("Great event!");
        assertThat(sentiment.getSentiment()).isEqualTo("POSITIVE");
    }

    @Test
    void eventResourceAllocation_ShouldSetAndGetFields() {
        EventResourceAllocation allocation = new EventResourceAllocation();
        allocation.setId(1L);
        allocation.setQuantityUsed(5);
        allocation.setNotes("Test notes");
        
        assertThat(allocation.getId()).isEqualTo(1L);
        assertThat(allocation.getQuantityUsed()).isEqualTo(5);
    }
}
