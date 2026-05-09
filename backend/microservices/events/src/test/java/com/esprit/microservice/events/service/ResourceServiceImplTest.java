package com.esprit.microservice.events.service;

import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.entity.ResourceType;
import com.esprit.microservice.events.repository.ResourceRepository;
import com.esprit.microservice.events.service.impl.ResourceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ResourceServiceImplTest {

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
    }

    @Test
    void getResourceById_ShouldReturnResource() {
        when(resourceRepository.findById(1L)).thenReturn(Optional.of(resource));

        Resource found = resourceService.getResourceById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
    }

    @Test
    void createResource_ShouldSaveAndReturn() {
        when(resourceRepository.save(resource)).thenReturn(resource);

        Resource created = resourceService.createResource(resource);

        assertThat(created).isNotNull();
        assertThat(created.getName()).isEqualTo("Projector");
    }
}
