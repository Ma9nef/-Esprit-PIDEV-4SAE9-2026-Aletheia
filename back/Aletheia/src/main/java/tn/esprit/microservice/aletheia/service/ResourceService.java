package tn.esprit.microservice.aletheia.service;

import tn.esprit.microservice.aletheia.entity.Resource;
import tn.esprit.microservice.aletheia.entity.ResourceType;

import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    Resource updateResource(Long id, Resource resource);
    void deleteResource(Long id);
    Resource getResourceById(Long id);
    List<Resource> getAllResources();
    List<Resource> getResourcesByType(ResourceType type);
    List<Resource> getAvailableResources();
    List<Resource> searchResourcesByName(String name);
    boolean isResourceAvailable(Long resourceId, Integer quantity);
    Resource updateResourceQuantity(Long id, Integer newQuantity);
}