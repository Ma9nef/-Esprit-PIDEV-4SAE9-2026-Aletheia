package tn.esprit.microservice.aletheia.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.microservice.aletheia.entity.Event;
import tn.esprit.microservice.aletheia.entity.EventStatus;
import tn.esprit.microservice.aletheia.exception.ResourceNotFoundException;
import tn.esprit.microservice.aletheia.repository.EventRepository;
import tn.esprit.microservice.aletheia.service.EventService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    @Override
    public Event createEvent(Event event) {
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.PLANNED);
        }
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);

        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setLocation(eventDetails.getLocation());
        event.setExpectedAttendees(eventDetails.getExpectedAttendees());
        event.setOrganizer(eventDetails.getOrganizer());

        if (eventDetails.getStatus() != null) {
            event.setStatus(eventDetails.getStatus());
        }

        return eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    @Override
    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    @Override
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getEventsByStatus(EventStatus status) {
        return eventRepository.findByStatus(status);
    }

    @Override
    public List<Event> getEventsByOrganizer(String organizer) {
        return eventRepository.findByOrganizer(organizer);
    }

    @Override
    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByStartDateBetween(start, end);
    }

    @Override
    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now());
    }

    @Override
    public Event updateEventStatus(Long id, EventStatus status) {
        Event event = getEventById(id);
        event.setStatus(status);
        return eventRepository.save(event);
    }

    @Override
    public boolean isEventCanceled(Long id) {
        Event event = getEventById(id);
        return event.getStatus() == EventStatus.CANCELLED;
    }
}