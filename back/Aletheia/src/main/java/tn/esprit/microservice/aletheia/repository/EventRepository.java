package tn.esprit.microservice.aletheia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.microservice.aletheia.entity.Event;
import tn.esprit.microservice.aletheia.entity.EventStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByOrganizer(String organizer);

    List<Event> findByStartDateBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT e FROM Event e WHERE e.location = :location")
    List<Event> findByLocation(@Param("location") String location);

    @Query("SELECT e FROM Event e WHERE e.startDate >= :date ORDER BY e.startDate ASC")
    List<Event> findUpcomingEvents(@Param("date") LocalDateTime date);
}