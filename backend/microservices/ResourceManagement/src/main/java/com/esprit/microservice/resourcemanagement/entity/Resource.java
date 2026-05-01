package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "resources", indexes = {
        @Index(name = "idx_resources_type", columnList = "type"),
        @Index(name = "idx_resources_deleted", columnList = "deleted"),
        @Index(name = "idx_resources_location", columnList = "location")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Resource {

    private static final Set<ResourceType> APPROVAL_REQUIRED_TYPES =
            Set.of(ResourceType.CLASSROOM, ResourceType.COMPUTER_LAB, ResourceType.AMPHITHEATER);

    @Transient
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ResourceType type;

    @Column
    private Integer capacity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String location;

    @Column(name = "requires_approval", nullable = false)
    @Builder.Default
    private Boolean requiresApproval = false;

    @Column(name = "condition_score")
    @Builder.Default
    private Integer conditionScore = 5;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", nullable = false, length = 50)
    @Builder.Default
    private MaintenanceStatus maintenanceStatus = MaintenanceStatus.OPERATIONAL;

    @Column(name = "max_reservation_hours")
    private Integer maxReservationHours;

    @Column(name = "min_advance_booking_hours")
    private Integer minAdvanceBookingHours;

    @Column(name = "attributes_json", columnDefinition = "TEXT")
    @Builder.Default
    private String attributesJson = "{}";

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (requiresApproval == null) {
            requiresApproval = APPROVAL_REQUIRED_TYPES.contains(type);
        }
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Map<String, Object> getAttributes() {
        try {
            return OBJECT_MAPPER.readValue(attributesJson, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    public void setAttributes(Map<String, Object> attributes) {
        try {
            attributesJson = OBJECT_MAPPER.writeValueAsString(attributes != null ? attributes : Map.of());
        } catch (JsonProcessingException e) {
            attributesJson = "{}";
        }
    }

    public boolean isAvailableForBooking() {
        return !Boolean.TRUE.equals(deleted)
                && maintenanceStatus == MaintenanceStatus.OPERATIONAL;
    }
}
