package com.esprit.microservice.courses.service.publicApi;

import com.esprit.microservice.courses.dto.course.publicDto.CoursePublicDTO;
import com.esprit.microservice.courses.service.core.CourseCoreService;
import com.esprit.microservice.courses.service.mapper.CourseMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PublicCourseServiceImpl implements PublicCourseService {

    private final CourseCoreService core;
    private final CourseMapper courseMapper;

    public PublicCourseServiceImpl(CourseCoreService core, CourseMapper courseMapper) {
        this.core = core;
        this.courseMapper = courseMapper;
    }

    @Override
    public Optional<CoursePublicDTO> getCourse(Long id) {
        return core.findPublicById(id)
                .map(courseMapper::toPublicDTO);
    }

    @Override
    public List<CoursePublicDTO> getCourses() {
        return core.findPublicAll()
                .stream()
                .map(courseMapper::toPublicDTO)
                .toList();
    }
}
