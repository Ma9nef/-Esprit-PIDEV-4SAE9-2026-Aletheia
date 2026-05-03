package com.esprit.microservice.events.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventStatus;
import com.esprit.microservice.events.exception.ResourceNotFoundException;
import com.esprit.microservice.events.exception.UserNotFoundException;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.service.EventService;
import com.esprit.microservice.events.service.UserService;
import com.esprit.microservice.events.dto.UserDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;
    private final UserService userService;

    @Override
    public Event createEvent(Event event) {
        log.info("Creating new event: {}", event.getTitle());

        // Validation de l'organisateur (optionnel)
        if (event.getOrganizer() != null && !event.getOrganizer().isEmpty()) {
            try {
                // Vérifier si l'organisateur existe dans le user-microservice
                UserDTO organizer = userService.getUserByEmail(event.getOrganizer());
                log.info("Event created by existing user: {} {}",
                        organizer.getPrenom(), organizer.getNom());

                // Optionnel: Vous pouvez enrichir l'événement avec des infos de l'utilisateur
                // event.setOrganizerFullName(organizer.getFullName());

            } catch (UserNotFoundException e) {
                log.warn("Organizer email not found in user service: {}", event.getOrganizer());
                // Décidez si vous voulez quand même créer l'événement ou rejeter
                // throw new IllegalArgumentException("Organizer does not exist");
            }
        }

        // Définir le statut par défaut si non spécifié
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.PLANNED);
        }

        // Validation des dates
        if (event.getStartDate() != null && event.getEndDate() != null) {
            if (event.getStartDate().isAfter(event.getEndDate())) {
                throw new IllegalArgumentException("Start date must be before end date");
            }
        }

        Event savedEvent = eventRepository.save(event);
        log.info("Event created successfully with id: {}", savedEvent.getId());

        return savedEvent;
    }

    @Override
    public Event updateEvent(Long id, Event eventDetails) {
        log.info("Updating event with id: {}", id);

        Event existingEvent = getEventById(id);

        // Mise à jour des champs
        existingEvent.setTitle(eventDetails.getTitle());
        existingEvent.setDescription(eventDetails.getDescription());
        existingEvent.setStartDate(eventDetails.getStartDate());
        existingEvent.setEndDate(eventDetails.getEndDate());
        existingEvent.setLocation(eventDetails.getLocation());
        existingEvent.setExpectedAttendees(eventDetails.getExpectedAttendees());

        // Si l'organisateur change, on peut valider le nouvel organisateur
        if (eventDetails.getOrganizer() != null &&
                !eventDetails.getOrganizer().equals(existingEvent.getOrganizer())) {

            // Optionnel: Vérifier le nouvel organisateur
            try {
                userService.getUserByEmail(eventDetails.getOrganizer());
                existingEvent.setOrganizer(eventDetails.getOrganizer());
            } catch (UserNotFoundException e) {
                log.warn("New organizer email not found: {}", eventDetails.getOrganizer());
                // Décidez si vous voulez quand même mettre à jour
                existingEvent.setOrganizer(eventDetails.getOrganizer());
            }
        }

        // Mise à jour du statut si fourni
        if (eventDetails.getStatus() != null) {
            existingEvent.setStatus(eventDetails.getStatus());
        }

        Event updatedEvent = eventRepository.save(existingEvent);
        log.info("Event updated successfully with id: {}", updatedEvent.getId());

        return updatedEvent;
    }

    @Override
    public void deleteEvent(Long id) {
        log.info("Deleting event with id: {}", id);

        Event event = getEventById(id);

        // Vérifier si l'événement peut être supprimé (par exemple, pas en cours)
        if (event.getStatus() == EventStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot delete an event that is in progress");
        }

        eventRepository.delete(event);
        log.info("Event deleted successfully with id: {}", id);
    }

    @Override
    public Event getEventById(Long id) {
        log.debug("Fetching event with id: {}", id);

        return eventRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Event not found with id: {}", id);
                    return new ResourceNotFoundException("Event not found with id: " + id);
                });
    }

    @Override
    public List<Event> getAllEvents() {
        log.debug("Fetching all events");
        return eventRepository.findAll();
    }

    @Override
    public List<Event> getEventsByStatus(EventStatus status) {
        log.debug("Fetching events by status: {}", status);
        return eventRepository.findByStatus(status);
    }

    @Override
    public List<Event> getEventsByOrganizer(String organizer) {
        log.debug("Fetching events by organizer: {}", organizer);
        return eventRepository.findByOrganizer(organizer);
    }

    @Override
    public List<Event> getEventsByDateRange(LocalDateTime start, LocalDateTime end) {
        log.debug("Fetching events between {} and {}", start, end);

        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }

        return eventRepository.findByStartDateBetween(start, end);
    }

    @Override
    public List<Event> getUpcomingEvents() {
        log.debug("Fetching upcoming events");
        return eventRepository.findUpcomingEvents(LocalDateTime.now());
    }

    @Override
    public Event updateEventStatus(Long id, EventStatus status) {
        log.info("Updating event status: id={}, new status={}", id, status);

        Event event = getEventById(id);

        // Validation de la transition de statut
        validateStatusTransition(event.getStatus(), status);

        event.setStatus(status);
        Event updatedEvent = eventRepository.save(event);

        log.info("Event status updated successfully: id={}, old status={}, new status={}",
                id, event.getStatus(), status);

        return updatedEvent;
    }

    @Override
    public boolean isEventCanceled(Long id) {
        Event event = getEventById(id);
        return event.getStatus() == EventStatus.CANCELLED;
    }

    /**
     * Valide les transitions de statut
     */
    private void validateStatusTransition(EventStatus currentStatus, EventStatus newStatus) {
        // Empêcher de passer de CANCELLED à autre chose
        if (currentStatus == EventStatus.CANCELLED && newStatus != EventStatus.CANCELLED) {
            throw new IllegalStateException("Cannot change status of a cancelled event");
        }

        // Empêcher de passer de COMPLETED à autre chose
        if (currentStatus == EventStatus.COMPLETED && newStatus != EventStatus.COMPLETED) {
            throw new IllegalStateException("Cannot change status of a completed event");
        }

        // Logique supplémentaire selon vos besoins
    }

    /**
     * Récupère les événements avec les informations de l'organisateur (enrichies)
     */
    public List<Event> getAllEventsWithOrganizerInfo() {
        List<Event> events = getAllEvents();

        for (Event event : events) {
            try {
                if (event.getOrganizer() != null) {
                    UserDTO organizer = userService.getUserByEmail(event.getOrganizer());
                    // Vous pourriez stocker ces infos dans un cache ou DTO
                    log.debug("Event {} organized by {}", event.getId(), organizer.getFullName());
                }
            } catch (Exception e) {
                log.warn("Could not fetch organizer info for event {}: {}",
                        event.getId(), e.getMessage());
            }
        }

        return events;
    }

    /**
     * Recherche avancée d'événements avec filtres
     */
    public List<Event> searchEvents(String title, String location,
                                    LocalDateTime startDate, LocalDateTime endDate,
                                    EventStatus status) {
        log.info("Searching events with filters");

        // Implémentez votre logique de recherche avancée ici
        // Vous pouvez utiliser un Specification ou un QueryDSL

        return eventRepository.findAll(); // À remplacer par votre logique
    }
}