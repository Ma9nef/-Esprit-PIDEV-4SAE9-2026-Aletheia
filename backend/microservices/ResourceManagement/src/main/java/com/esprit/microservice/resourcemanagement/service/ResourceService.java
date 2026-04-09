package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.request.UpdateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.exception.ResourceNotFoundException;
import com.esprit.microservice.resourcemanagement.mapper.ResourceMapper;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
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
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ResourceMapper resourceMapper;

    @Transactional
    public ResourceResponse createResource(CreateResourceRequest request) {
        log.info("Creating resource: name={}, type={}", request.getName(), request.getType());
        Resource resource = resourceMapper.toEntity(request);
        Resource saved = resourceRepository.save(resource);
        log.info("Resource created with id={}", saved.getId());
        return resourceMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAllByDeletedFalse()
                .stream()
                .map(resourceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> getResourcesByType(ResourceType type) {
        return resourceRepository.findAllByTypeAndDeletedFalse(type)
                .stream()
                .map(resourceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResourceResponse getResourceById(UUID id) {
        Resource resource = findResourceOrThrow(id);
        return resourceMapper.toResponse(resource);
    }

    @Transactional
    public ResourceResponse updateResource(UUID id, UpdateResourceRequest request) {
        log.info("Updating resource id={}", id);
        Resource resource = findResourceOrThrow(id);

        if (request.getName() != null) {
            resource.setName(request.getName());
        }
        if (request.getType() != null) {
            resource.setType(request.getType());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getMetadata() != null) {
            resource.setMetadata(request.getMetadata());
        }

        Resource updated = resourceRepository.save(resource);
        log.info("Resource updated id={}", updated.getId());
        return resourceMapper.toResponse(updated);
    }

    /**
     * Soft-delete a resource. Does not physically remove the row.
     */
    @Transactional
    public void deleteResource(UUID id) {
        log.info("Soft-deleting resource id={}", id);
        Resource resource = findResourceOrThrow(id);
        resource.setDeleted(true);
        resourceRepository.save(resource);
        log.info("Resource soft-deleted id={}", id);
    }

    /**
     * Internal helper — returns the entity for use by other services.
     */
    @Transactional(readOnly = true)
    public Resource findResourceOrThrow(UUID id) {
        return resourceRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));
    }
}
