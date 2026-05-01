package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceAvailabilityResponse;
import com.esprit.microservice.resourcemanagement.entity.ResourceAvailability;
import com.esprit.microservice.resourcemanagement.exception.InvalidTimeRangeException;
import com.esprit.microservice.resourcemanagement.mapper.AvailabilityMapper;
import com.esprit.microservice.resourcemanagement.repository.ResourceAvailabilityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResourceAvailabilityService {

    private final ResourceAvailabilityRepository availabilityRepository;
    private final ResourceService resourceService;
    private final AvailabilityMapper availabilityMapper;

    @Transactional
    public ResourceAvailabilityResponse createAvailability(UUID resourceId, CreateAvailabilityRequest request) {
        // Validate resource exists
        resourceService.findOrThrow(resourceId);

        // Validate time range
        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new InvalidTimeRangeException();
        }

        log.info("Creating availability for resource={}, from={} to={}",
                resourceId, request.getStartTime(), request.getEndTime());

        ResourceAvailability availability = availabilityMapper.toEntity(resourceId, request);
        ResourceAvailability saved = availabilityRepository.save(availability);

        log.info("Availability created id={} for resource={}", saved.getId(), resourceId);
        return availabilityMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResourceAvailabilityResponse> getAvailability(UUID resourceId) {
        // Validate resource exists
        resourceService.findOrThrow(resourceId);

        return availabilityRepository.findByResourceIdOrderByStartTimeAsc(resourceId)
                .stream()
                .map(availabilityMapper::toResponse)
                .collect(Collectors.toList());
    }
}
