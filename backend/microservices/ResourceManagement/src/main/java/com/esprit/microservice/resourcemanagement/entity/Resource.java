package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "resources", indexes = {
        @Index(name = "idx_resources_type", columnList = "type"),
        @Index(name = "idx_resources_deleted", columnList = "deleted"),
        @Index(name = "idx_resources_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

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
    @Builder.Default
    private String metadataJson = "{}";

    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.deleted == null) this.deleted = false;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Custom getter for metadata that converts JSON string to Map
    public Map<String, Object> getMetadata() {
        try {
            return objectMapper.readValue(metadataJson, new TypeReference<Map<String, Object>>() {});
        } catch (JsonProcessingException e) {
            return new HashMap<>();
        }
    }

    // Custom setter for metadata that converts Map to JSON string
    public void setMetadata(Map<String, Object> metadata) {
        try {
            this.metadataJson = objectMapper.writeValueAsString(metadata != null ? metadata : new HashMap<>());
        } catch (JsonProcessingException e) {
            this.metadataJson = "{}";
        }
    }
}
