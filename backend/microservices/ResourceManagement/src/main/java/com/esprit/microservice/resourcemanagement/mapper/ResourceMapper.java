package com.esprit.microservice.resourcemanagement.mapper;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ResourceMapper {

    public Resource toEntity(CreateResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .build();

        // Set metadata using the custom setter
        resource.setMetadata(request.getMetadata() != null ? request.getMetadata() : Map.of());

        return resource;
    }

    public ResourceResponse toResponse(Resource entity) {
        return ResourceResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .capacity(entity.getCapacity())
                .metadata(entity.getMetadata())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
