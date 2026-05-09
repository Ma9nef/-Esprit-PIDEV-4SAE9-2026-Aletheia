package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.EventDTO;
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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    @Mock
    private EventService eventService;

    @InjectMocks
    private EventController eventController;

    @Test
    void getAllEvents_ShouldReturnOk() {
        // Le contr?leur retourne List<EventDTO> mais sans appel direct ? eventService
        // Il convertit les events en DTOs
        ResponseEntity<List<EventDTO>> response = eventController.getAllEvents();
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
    }
}
