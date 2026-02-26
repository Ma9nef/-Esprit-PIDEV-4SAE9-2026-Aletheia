package com.esprit.microservice.courses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter @Getter @NoArgsConstructor @AllArgsConstructor
@Table(name = "assessments")
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Enumerated(EnumType.STRING)
    private AssessmentType type;
    private Double totalScore;
    private LocalDateTime dueDate;

    @ManyToOne
     // Keep this ignored so we don't load the whole course
    @JoinColumn(name = "course_id")
    private Course course;

    @JsonIgnore // Keep this ignored
    @OneToMany(mappedBy = "assessment")
    private List<Submission> submissions;

    // REMOVED @JsonIgnore here so questions show up in your JSON
    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Question> questions;
}