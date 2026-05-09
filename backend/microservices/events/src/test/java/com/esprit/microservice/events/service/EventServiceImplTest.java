package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.service.impl.EventServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventServiceImplTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventServiceImpl eventService;

    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
    }

    @Test
    void getEventById_ShouldReturnEvent() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        Event found = eventService.getEventById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
    }

    @Test
    void getAllEvents_ShouldReturnList() {
        when(eventRepository.findAll()).thenReturn(java.util.Arrays.asList(event));

        var result = eventService.getAllEvents();

        assertThat(result).hasSize(1);
    }

    @Test
    void createEvent_ShouldReturnSavedEvent() {
        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event created = eventService.createEvent(event);

        assertThat(created).isNotNull();
        assertThat(created.getTitle()).isEqualTo("Test Event");
    }
}
