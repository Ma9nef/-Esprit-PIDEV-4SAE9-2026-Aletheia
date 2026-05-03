package com.esprit.microservice.courses.dto.lesson.publicDto;

public class CourseProgressResponseDTO {

    private int percent;
    private long completedLessons;
    private long totalLessons;

    public CourseProgressResponseDTO(int percent, long completedLessons, long totalLessons) {
        this.percent = percent;
        this.completedLessons = completedLessons;
        this.totalLessons = totalLessons;
    }

    public int getPercent() { return percent; }
    public long getCompletedLessons() { return completedLessons; }
    public long getTotalLessons() { return totalLessons; }
}