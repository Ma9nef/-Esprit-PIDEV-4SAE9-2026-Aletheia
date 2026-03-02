package tn.esprit.microservice.aletheia.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.microservice.aletheia.entity.Event;
import tn.esprit.microservice.aletheia.entity.EventResourceAllocation;
import tn.esprit.microservice.aletheia.entity.Resource;
import tn.esprit.microservice.aletheia.exception.ResourceNotFoundException;
import tn.esprit.microservice.aletheia.exception.ResourceUnavailableException;
import tn.esprit.microservice.aletheia.repository.EventResourceAllocationRepository;
import tn.esprit.microservice.aletheia.repository.EventRepository;
import tn.esprit.microservice.aletheia.repository.ResourceRepository;
import tn.esprit.microservice.aletheia.service.EventResourceAllocationService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventResourceAllocationServiceImpl implements EventResourceAllocationService {

    private final EventResourceAllocationRepository allocationRepository;
    private final EventRepository eventRepository;
    private final ResourceRepository resourceRepository;
    @Override
    public List<EventResourceAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }
    @Override
    public EventResourceAllocation allocateResource(EventResourceAllocation allocation) {
        // Vérifier si la ressource est disponible
        if (!checkResourceAvailability(allocation)) {
            throw new ResourceUnavailableException("Resource is not available for the specified time period");
        }

        // Charger les entités associées
        Event event = eventRepository.findById(allocation.getEvent().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Resource resource = resourceRepository.findById(allocation.getResource().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        allocation.setEvent(event);
        allocation.setResource(resource);

        return allocationRepository.save(allocation);
    }

    @Override
    public EventResourceAllocation updateAllocation(Long id, EventResourceAllocation allocationDetails) {
        EventResourceAllocation allocation = getAllocationById(id);

        if (!checkResourceAvailability(allocationDetails)) {
            throw new ResourceUnavailableException("Resource is not available for the updated time period");
        }

        allocation.setQuantityUsed(allocationDetails.getQuantityUsed());
        allocation.setStartTime(allocationDetails.getStartTime());
        allocation.setEndTime(allocationDetails.getEndTime());
        allocation.setNotes(allocationDetails.getNotes());

        return allocationRepository.save(allocation);
    }

    @Override
    public void deleteAllocation(Long id) {
        EventResourceAllocation allocation = getAllocationById(id);
        allocationRepository.delete(allocation);
    }

    @Override
    public EventResourceAllocation getAllocationById(Long id) {
        return allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + id));
    }

    @Override
    public List<EventResourceAllocation> getAllocationsByEvent(Long eventId) {
        return allocationRepository.findByEventId(eventId);
    }

    @Override
    public List<EventResourceAllocation> getAllocationsByResource(Long resourceId) {
        return allocationRepository.findByResourceId(resourceId);
    }

    @Override
    public boolean checkResourceAvailability(EventResourceAllocation allocation) {
        List<EventResourceAllocation> conflicts = allocationRepository.findConflictingAllocations(
                allocation.getResource().getId(),
                allocation.getStartTime(),
                allocation.getEndTime()
        );

        // Exclure l'allocation actuelle si c'est une mise à jour
        if (allocation.getId() != null) {
            conflicts.removeIf(a -> a.getId().equals(allocation.getId()));
        }

        // Calculer la quantité totale demandée pendant la période
        int totalRequested = allocation.getQuantityUsed();
        for (EventResourceAllocation conflict : conflicts) {
            totalRequested += conflict.getQuantityUsed();
        }

        // Vérifier si la quantité totale dépasse la disponibilité
        Resource resource = resourceRepository.findById(allocation.getResource().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        return totalRequested <= resource.getTotalQuantity();
    }

    @Override
    public List<EventResourceAllocation> getConflictingAllocations(Long resourceId,
                                                                   Long eventId,
                                                                   EventResourceAllocation allocation) {
        return allocationRepository.findConflictingAllocations(
                resourceId,
                allocation.getStartTime(),
                allocation.getEndTime()
        );
    }

    @Override
    public Integer getTotalResourceUsage(Long resourceId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return allocationRepository.getTotalResourceUsage(resourceId, thirtyDaysAgo);
    }
}