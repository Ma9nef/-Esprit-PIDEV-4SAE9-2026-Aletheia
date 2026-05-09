package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.service.EventService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventControllerSimpleTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @Test
    void getAllEvents_ShouldReturnOk() {
        Event event = new Event();
        event.setId(1L);
        
        when(eventService.getAllEvents()).thenReturn(Arrays.asList(event));
        
        ResponseEntity<java.util.List<Event>> response = eventController.getAllEvents();
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
