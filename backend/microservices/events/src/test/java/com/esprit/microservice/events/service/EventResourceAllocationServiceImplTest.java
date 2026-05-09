package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventResourceAllocation;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.repository.EventResourceAllocationRepository;
import com.esprit.microservice.events.repository.ResourceRepository;
import com.esprit.microservice.events.service.impl.EventResourceAllocationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EventResourceAllocationServiceImplTest {

    @Mock
    private EventResourceAllocationRepository allocationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private EventResourceAllocationServiceImpl allocationService;

    private Event event;
    private Resource resource;
    private EventResourceAllocation allocation;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(1L);

        resource = new Resource();
        resource.setId(1L);
        resource.setTotalQuantity(10);

        allocation = new EventResourceAllocation();
        allocation.setId(1L);
        allocation.setEvent(event);
        allocation.setResource(resource);
        allocation.setQuantityUsed(2);
        allocation.setStartTime(LocalDateTime.now().plusHours(1));
        allocation.setEndTime(LocalDateTime.now().plusHours(3));
    }

    @Test
    void getAllAllocations_ShouldReturnList() {
        List<EventResourceAllocation> allocations = new ArrayList<>();
        allocations.add(allocation);
        when(allocationRepository.findAll()).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllAllocations();

        assertThat(result).hasSize(1);
    }

    @Test
    void getAllocationById_ShouldReturnAllocation() {
        when(allocationRepository.findById(1L)).thenReturn(Optional.of(allocation));

        EventResourceAllocation found = allocationService.getAllocationById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
    }

    @Test
    void getAllocationsByEvent_ShouldReturnList() {
        List<EventResourceAllocation> allocations = new ArrayList<>();
        allocations.add(allocation);
        when(allocationRepository.findByEventId(1L)).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllocationsByEvent(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void getAllocationsByResource_ShouldReturnList() {
        List<EventResourceAllocation> allocations = new ArrayList<>();
        allocations.add(allocation);
        when(allocationRepository.findByResourceId(1L)).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllocationsByResource(1L);

        assertThat(result).hasSize(1);
    }
}
