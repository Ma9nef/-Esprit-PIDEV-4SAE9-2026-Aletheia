package com.esprit.microservice.events.service.impl;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventResourceAllocation;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.exception.ResourceNotFoundException;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.repository.EventResourceAllocationRepository;
import com.esprit.microservice.events.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

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
        event.setTitle("Test Event");

        resource = new Resource();
        resource.setId(1L);
        resource.setName("Projector");
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
        List<EventResourceAllocation> allocations = Arrays.asList(allocation);
        when(allocationRepository.findAll()).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllAllocations();

        assertThat(result).hasSize(1);
    }

    @Test
    void getAllocationById_WhenExists_ShouldReturnAllocation() {
        when(allocationRepository.findById(1L)).thenReturn(Optional.of(allocation));

        EventResourceAllocation found = allocationService.getAllocationById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
    }

    @Test
    void getAllocationById_WhenNotExists_ShouldThrowException() {
        when(allocationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> allocationService.getAllocationById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void allocateResource_ShouldSaveAndReturn() {
        lenient().when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        lenient().when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));
        lenient().when(allocationRepository.save(any(EventResourceAllocation.class))).thenReturn(allocation);
        lenient().when(resourceRepository.findById(any())).thenReturn(Optional.of(resource));
        lenient().when(allocationRepository.findConflictingAllocations(any(), any(), any()))
            .thenReturn(new ArrayList<>());

        EventResourceAllocation result = allocationService.allocateResource(allocation);

        assertThat(result).isNotNull();
    }

    @Test
    void allocateResource_WhenEventNotFound_ShouldThrowException() {
        lenient().when(eventRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> allocationService.allocateResource(allocation))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void allocateResource_WhenResourceNotFound_ShouldThrowException() {
        lenient().when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
        lenient().when(resourceRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> allocationService.allocateResource(allocation))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deleteAllocation_ShouldDelete() {
        when(allocationRepository.findById(1L)).thenReturn(Optional.of(allocation));

        allocationService.deleteAllocation(1L);

        verify(allocationRepository).delete(allocation);
    }

    @Test
    void deleteAllocation_WhenNotExists_ShouldThrowException() {
        when(allocationRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> allocationService.deleteAllocation(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void getAllocationsByEvent_ShouldReturnList() {
        List<EventResourceAllocation> allocations = Arrays.asList(allocation);
        when(allocationRepository.findByEventId(1L)).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllocationsByEvent(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void getAllocationsByResource_ShouldReturnList() {
        List<EventResourceAllocation> allocations = Arrays.asList(allocation);
        when(allocationRepository.findByResourceId(1L)).thenReturn(allocations);

        List<EventResourceAllocation> result = allocationService.getAllocationsByResource(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void getTotalResourceUsage_ShouldReturnValue() {
        when(allocationRepository.getTotalResourceUsage(eq(1L), any(LocalDateTime.class)))
                .thenReturn(5);

        Integer result = allocationService.getTotalResourceUsage(1L);

        assertThat(result).isEqualTo(5);
    }
}
