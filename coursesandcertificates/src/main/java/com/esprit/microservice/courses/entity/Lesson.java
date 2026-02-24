package com.esprit.microservice.courses.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "lessons",
        indexes = {
                @Index(name = "idx_lessons_course_order", columnList = "course_id, order_index")
        })
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String contentText; // partie texte de la leçon

    @Column(length = 32)
    private String youtubeVideoId;

    @Column(length = 255)
    private String pdfRef; // path / key / id (selon ton stockage)

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "course_id")
    @JsonBackReference
    private Course course;

    public Lesson() {}


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getYoutubeVideoId() { return youtubeVideoId; }
    public void setYoutubeVideoId(String youtubeVideoId) { this.youtubeVideoId = youtubeVideoId; }

    public String getPdfRef() { return pdfRef; }
    public void setPdfRef(String pdfRef) { this.pdfRef = pdfRef; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}