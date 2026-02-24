package com.esprit.microservice.courses.service.mapper;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.publicDto.CoursePublicDTO;
import com.esprit.microservice.courses.entity.Course;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public CourseAdminDTO toAdminDTO(Course course) {
        if (course == null) return null;

        CourseAdminDTO dto = new CourseAdminDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setInstructorName(course.getInstructorName());
        dto.setPrice(course.getPrice());
        dto.setDurationHours(course.getDurationHours());
        dto.setArchived(course.isArchived());
        dto.setCreatedAt(course.getCreatedAt());
        dto.setUpdatedAt(course.getUpdatedAt());
        return dto;
    }

    public CoursePublicDTO toPublicDTO(Course course) {
        if (course == null) return null;

        CoursePublicDTO dto = new CoursePublicDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setInstructorName(course.getInstructorName());
        dto.setPrice(course.getPrice());
        dto.setDurationHours(course.getDurationHours());
        dto.setCreatedAt(course.getCreatedAt());
        return dto;
    }
}
