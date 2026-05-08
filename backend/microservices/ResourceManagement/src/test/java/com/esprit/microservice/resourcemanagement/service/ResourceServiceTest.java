package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.request.UpdateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.exception.ResourceNotFoundException;
import com.esprit.microservice.resourcemanagement.mapper.ResourceMapper;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ResourceService — Unit Tests")
class ResourceServiceTest {

    @Mock
    private ResourceRepository resourceRepository;

    @Mock
    private ResourceMapper resourceMapper;

    @InjectMocks
    private ResourceService resourceService;

    private UUID resourceId;
    private Resource resource;
    private ResourceResponse resourceResponse;

    @BeforeEach
    void setUp() {
        resourceId = UUID.randomUUID();

        resource = Resource.builder()
                .id(resourceId)
                .name("Room A101")
                .type(ResourceType.ROOM)
                .capacity(30)
                .deleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        resourceResponse = ResourceResponse.builder()
                .id(resourceId)
                .name("Room A101")
                .type(ResourceType.ROOM)
                .capacity(30)
                .build();
    }

    // ── createResource ────────────────────────────────────────────────────────

    @Test
    @DisplayName("createResource: should save and return response")
    void createResource_success() {
        CreateResourceRequest request = CreateResourceRequest.builder()
                .name("Room A101")
                .type(ResourceType.ROOM)
                .capacity(30)
                .build();

        when(resourceMapper.toEntity(request)).thenReturn(resource);
        when(resourceRepository.save(resource)).thenReturn(resource);
        when(resourceMapper.toResponse(resource)).thenReturn(resourceResponse);

        ResourceResponse result = resourceService.createResource(request);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Room A101");
        assertThat(result.getType()).isEqualTo(ResourceType.ROOM);
        verify(resourceRepository).save(resource);
    }

    // ── getAllResources ────────────────────────────────────────────────────────

    @Test
    @DisplayName("getAllResources: should return list of active resources")
    void getAllResources_returnsList() {
        when(resourceRepository.findAllByDeletedFalse()).thenReturn(List.of(resource));
        when(resourceMapper.toResponse(resource)).thenReturn(resourceResponse);

        List<ResourceResponse> result = resourceService.getAllResources();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Room A101");
    }

    @Test
    @DisplayName("getAllResources: should return empty list when no resources exist")
    void getAllResources_empty() {
        when(resourceRepository.findAllByDeletedFalse()).thenReturn(List.of());

        List<ResourceResponse> result = resourceService.getAllResources();

        assertThat(result).isEmpty();
    }

    // ── getResourceById ───────────────────────────────────────────────────────

    @Test
    @DisplayName("getResourceById: should return resource when found")
    void getResourceById_found() {
        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.of(resource));
        when(resourceMapper.toResponse(resource)).thenReturn(resourceResponse);

        ResourceResponse result = resourceService.getResourceById(resourceId);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(resourceId);
    }

    @Test
    @DisplayName("getResourceById: should throw ResourceNotFoundException when not found")
    void getResourceById_notFound() {
        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.getResourceById(resourceId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(resourceId.toString());
    }

    // ── updateResource ────────────────────────────────────────────────────────

    @Test
    @DisplayName("updateResource: should update only provided fields")
    void updateResource_partialUpdate() {
        UpdateResourceRequest request = UpdateResourceRequest.builder()
                .name("Room B202")
                .capacity(50)
                .build();

        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(resource)).thenReturn(resource);
        when(resourceMapper.toResponse(resource)).thenReturn(
                ResourceResponse.builder().id(resourceId).name("Room B202").capacity(50).type(ResourceType.ROOM).build()
        );

        ResourceResponse result = resourceService.updateResource(resourceId, request);

        assertThat(result.getName()).isEqualTo("Room B202");
        assertThat(result.getCapacity()).isEqualTo(50);
        verify(resourceRepository).save(any(Resource.class));
    }

    @Test
    @DisplayName("updateResource: should throw when resource not found")
    void updateResource_notFound() {
        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.updateResource(resourceId, UpdateResourceRequest.builder().build()))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ── deleteResource ────────────────────────────────────────────────────────

    @Test
    @DisplayName("deleteResource: should soft-delete by setting deleted=true")
    void deleteResource_setsDeletedFlag() {
        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(resource);

        resourceService.deleteResource(resourceId);

        assertThat(resource.getDeleted()).isTrue();
        verify(resourceRepository).save(resource);
    }

    @Test
    @DisplayName("deleteResource: should throw when resource not found")
    void deleteResource_notFound() {
        when(resourceRepository.findByIdAndDeletedFalse(resourceId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.deleteResource(resourceId))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(resourceRepository, never()).save(any());
    }
}
