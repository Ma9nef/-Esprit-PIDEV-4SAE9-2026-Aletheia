package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.entity.ResourceType;
import com.esprit.microservice.events.exception.ResourceNotFoundException;
import com.esprit.microservice.events.repository.ResourceRepository;
import com.esprit.microservice.events.service.impl.ResourceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResourceServiceCompleteTest {

    @Mock
    private ResourceRepository resourceRepository;

    @InjectMocks
    private ResourceServiceImpl resourceService;

    private Resource resource;

    @BeforeEach
    void setUp() {
        resource = new Resource();
        resource.setId(1L);
        resource.setName("Projector");
        resource.setType(ResourceType.EQUIPMENT);
        resource.setTotalQuantity(5);
        resource.setReusable(true);
        resource.setLocation("Room A");
    }

    @Test
    void createResource_ShouldSetDefaults() {
        Resource newResource = new Resource();
        newResource.setName("New Resource");
        
        when(resourceRepository.save(any(Resource.class))).thenReturn(newResource);

        Resource created = resourceService.createResource(newResource);

        assertThat(created.getName()).isEqualTo("New Resource");
    }

    @Test
    void getAllResources_ShouldReturnList() {
        List<Resource> resources = Arrays.asList(resource, new Resource());
        when(resourceRepository.findAll()).thenReturn(resources);

        List<Resource> result = resourceService.getAllResources();

        assertThat(result).hasSize(2);
    }

    @Test
    void getResourcesByType_ShouldReturnFiltered() {
        List<Resource> resources = Arrays.asList(resource);
        when(resourceRepository.findByType(ResourceType.EQUIPMENT)).thenReturn(resources);

        List<Resource> result = resourceService.getResourcesByType(ResourceType.EQUIPMENT);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getType()).isEqualTo(ResourceType.EQUIPMENT);
    }

    @Test
    void getAvailableResources_ShouldReturn() {
        List<Resource> resources = Arrays.asList(resource);
        when(resourceRepository.findAvailableResources()).thenReturn(resources);

        List<Resource> result = resourceService.getAvailableResources();

        assertThat(result).hasSize(1);
    }

    @Test
    void isResourceAvailable_WhenSufficient_ShouldReturnTrue() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));

        boolean available = resourceService.isResourceAvailable(1L, 3);

        assertThat(available).isTrue();
    }

    @Test
    void isResourceAvailable_WhenInsufficient_ShouldReturnFalse() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));

        boolean available = resourceService.isResourceAvailable(1L, 10);

        assertThat(available).isFalse();
    }

    @Test
    void updateResource_ShouldUpdate() {
        Resource updatedDetails = new Resource();
        updatedDetails.setName("New Name");
        updatedDetails.setTotalQuantity(20);

        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(resource);

        Resource result = resourceService.updateResource(1L, updatedDetails);

        assertThat(result.getName()).isEqualTo("New Name");
    }

    @Test
    void updateResourceQuantity_ShouldUpdate() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));
        when(resourceRepository.save(any(Resource.class))).thenReturn(resource);

        Resource result = resourceService.updateResourceQuantity(1L, 20);

        assertThat(result.getTotalQuantity()).isEqualTo(20);
    }

    @Test
    void deleteResource_ShouldDelete() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));
        doNothing().when(resourceRepository).delete(resource);

        resourceService.deleteResource(1L);

        verify(resourceRepository, times(1)).delete(resource);
    }

    @Test
    void getResourceById_WhenNotExists_ShouldThrow() {
        when(resourceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> resourceService.getResourceById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
