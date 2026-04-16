package com.esprit.microservice.courses.entity.formations;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "formations")
public class Formation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instructor_id", nullable = false)
    private Long instructorId;

    @NotBlank(message = "Title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1")
    @Column(nullable = false)
    private Integer duration;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private Boolean archived = true;

    public Formation() {
    }

    public Formation(Long id, Long instructorId, String title, String description, Integer duration, Integer capacity, Boolean archived) {
        this.id = id;
        this.instructorId = instructorId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.capacity = capacity;
        this.archived = archived;
    }

    public Formation(Long instructorId, String title, String description, Integer duration, Integer capacity, Boolean archived) {
        this.instructorId = instructorId;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.capacity = capacity;
        this.archived = archived;
    }

    public Long getId() {
        return id;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getDuration() {
        return duration;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Boolean getArchived() {
        return archived;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setArchived(Boolean archived) {
        this.archived = archived;
    }
}