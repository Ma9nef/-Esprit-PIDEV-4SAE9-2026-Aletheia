package com.esprit.microservice.courses.dto.lesson.publicDto;

public class LessonPublicDTO {
    private Long id;
    private String title;
    private Integer orderIndex;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
