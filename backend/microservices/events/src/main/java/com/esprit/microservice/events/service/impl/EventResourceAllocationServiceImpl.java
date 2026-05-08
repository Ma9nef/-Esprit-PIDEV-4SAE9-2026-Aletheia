package com.esprit.microservice.events.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventResourceAllocation;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.exception.ResourceNotFoundException;
import com.esprit.microservice.events.exception.ResourceUnavailableException;
import com.esprit.microservice.events.repository.EventResourceAllocationRepository;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.repository.ResourceRepository;
import com.esprit.microservice.events.service.EventResourceAllocationService;

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
        if (!checkResourceAvailability(allocation)) {
            throw new ResourceUnavailableException("Resource is not available for the specified time period");
        }

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

        if (allocation.getId() != null) {
            conflicts.removeIf(a -> a.getId().equals(allocation.getId()));
        }

        int totalRequested = allocation.getQuantityUsed();
        for (EventResourceAllocation conflict : conflicts) {
            totalRequested += conflict.getQuantityUsed();
        }

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