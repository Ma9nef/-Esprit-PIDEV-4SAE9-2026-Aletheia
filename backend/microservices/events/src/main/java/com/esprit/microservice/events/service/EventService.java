package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface EventService {
    Event createEvent(Event event);
    Event updateEvent(Long id, Event event);
    void deleteEvent(Long id);
    Event getEventById(Long id);
    List<Event> getAllEvents();
    List<Event> getEventsByStatus(EventStatus status);
    List<Event> getEventsByOrganizer(String organizer);
    List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end);
    List<Event> getUpcomingEvents();
    Event updateEventStatus(Long id, EventStatus status);
    boolean isEventCanceled(Long id);
}