package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.service.ResourceService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ResourceController.class)
@DisplayName("ResourceController — Integration Tests")
class ResourceControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ResourceService resourceService;

    // ── GET /api/resources — public ───────────────────────────────────────────

    @Test
    @DisplayName("GET /api/resources: should return 200 without authentication")
    void getAllResources_public_returns200() throws Exception {
        UUID id = UUID.randomUUID();
        ResourceResponse response = ResourceResponse.builder()
                .id(id).name("Room A").type(ResourceType.ROOM).capacity(20).build();

        when(resourceService.getAllResources()).thenReturn(List.of(response));

        mockMvc.perform(get("/api/resources"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Room A"))
                .andExpect(jsonPath("$[0].type").value("ROOM"));
    }

    @Test
    @DisplayName("GET /api/resources/{id}: should return 200 without authentication")
    void getResourceById_public_returns200() throws Exception {
        UUID id = UUID.randomUUID();
        ResourceResponse response = ResourceResponse.builder()
                .id(id).name("Device X").type(ResourceType.DEVICE).build();

        when(resourceService.getResourceById(id)).thenReturn(response);

        mockMvc.perform(get("/api/resources/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Device X"));
    }

    // ── POST /api/resources — ADMIN only ──────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/resources: ADMIN should create resource and return 201")
    void createResource_admin_returns201() throws Exception {
        UUID id = UUID.randomUUID();
        CreateResourceRequest request = CreateResourceRequest.builder()
                .name("Lab 3").type(ResourceType.DEVICE).capacity(15).build();

        ResourceResponse response = ResourceResponse.builder()
                .id(id).name("Lab 3").type(ResourceType.DEVICE).capacity(15).build();

        when(resourceService.createResource(any(CreateResourceRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/resources")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Lab 3"))
                .andExpect(jsonPath("$.type").value("DEVICE"));
    }

    @Test
    @DisplayName("POST /api/resources: unauthenticated should return 401")
    void createResource_unauthenticated_returns401() throws Exception {
        CreateResourceRequest request = CreateResourceRequest.builder()
                .name("Lab 3").type(ResourceType.DEVICE).build();

        mockMvc.perform(post("/api/resources")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "LEARNER")
    @DisplayName("POST /api/resources: LEARNER should be forbidden (403)")
    void createResource_learner_returns403() throws Exception {
        CreateResourceRequest request = CreateResourceRequest.builder()
                .name("Lab 3").type(ResourceType.DEVICE).build();

        mockMvc.perform(post("/api/resources")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    // ── DELETE /api/resources/{id} — ADMIN only ───────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/resources/{id}: ADMIN should return 204")
    void deleteResource_admin_returns204() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/resources/{id}", id).with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "INSTRUCTOR")
    @DisplayName("DELETE /api/resources/{id}: INSTRUCTOR should be forbidden (403)")
    void deleteResource_instructor_returns403() throws Exception {
        UUID id = UUID.randomUUID();

        mockMvc.perform(delete("/api/resources/{id}", id).with(csrf()))
                .andExpect(status().isForbidden());
    }

    // ── Validation ────────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/resources: missing name should return 400")
    void createResource_missingName_returns400() throws Exception {
        CreateResourceRequest request = CreateResourceRequest.builder()
                .type(ResourceType.ROOM).build(); // name is missing

        mockMvc.perform(post("/api/resources")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
