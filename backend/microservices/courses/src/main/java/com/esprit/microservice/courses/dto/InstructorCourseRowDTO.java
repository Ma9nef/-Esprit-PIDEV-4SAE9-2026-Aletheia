package com.esprit.microservice.courses.dto;

public record InstructorCourseRowDTO(
        Long id,
        String title,
        long enrollments,
        boolean archived
) {}