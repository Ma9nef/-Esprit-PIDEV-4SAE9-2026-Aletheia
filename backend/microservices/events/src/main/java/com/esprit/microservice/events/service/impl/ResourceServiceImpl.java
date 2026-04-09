package com.esprit.microservice.events.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.entity.ResourceType;
import com.esprit.microservice.events.exception.ResourceNotFoundException;
import com.esprit.microservice.events.repository.ResourceRepository;
import com.esprit.microservice.events.service.ResourceService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    @Override
    public Resource createResource(Resource resource) {
        if (resource.getTotalQuantity() == null) {
            resource.setTotalQuantity(1);
        }
        if (resource.getReusable() == null) {
            resource.setReusable(true);
        }
        return resourceRepository.save(resource);
    }

    @Override
    public Resource updateResource(Long id, Resource resourceDetails) {
        Resource resource = getResourceById(id);

        resource.setName(resourceDetails.getName());
        resource.setDescription(resourceDetails.getDescription());
        resource.setType(resourceDetails.getType());
        resource.setTotalQuantity(resourceDetails.getTotalQuantity());
        resource.setReusable(resourceDetails.getReusable());
        resource.setLocation(resourceDetails.getLocation());

        return resourceRepository.save(resource);
    }

    @Override
    public void deleteResource(Long id) {
        Resource resource = getResourceById(id);
        resourceRepository.delete(resource);
    }

    @Override
    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public List<Resource> getResourcesByType(ResourceType type) {
        return resourceRepository.findByType(type);
    }

    @Override
    public List<Resource> getAvailableResources() {
        return resourceRepository.findAvailableResources();
    }

    @Override
    public List<Resource> searchResourcesByName(String name) {
        return resourceRepository.searchByName(name);
    }

    @Override
    public boolean isResourceAvailable(Long resourceId, Integer quantity) {
        Resource resource = getResourceById(resourceId);
        return resource.getTotalQuantity() >= quantity;
    }

    @Override
    public Resource updateResourceQuantity(Long id, Integer newQuantity) {
        Resource resource = getResourceById(id);
        resource.setTotalQuantity(newQuantity);
        return resourceRepository.save(resource);
    }
}