package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseCoreServiceImpl implements CourseCoreService {

    private final CourseRepository courseRepo;

    public CourseCoreServiceImpl(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    @Override
    public Optional<Course> findById(Long id) {
        return courseRepo.findById(id);
    }

    @Override
    public Optional<Course> findPublicById(Long id) {
        return courseRepo.findByIdAndArchivedFalse(id);
    }

    @Override
    public List<Course> findAll() {
        return courseRepo.findAll();
    }

    @Override
    public List<Course> findPublicAll() {
        return courseRepo.findByArchivedFalse();
    }



    @Override
    public Course save(Course course) {
        return courseRepo.save(course);
    }
    @Override
    public List<Course> findByInstructorId(Long instructorId) {
        return courseRepo.findByInstructorId(instructorId);
    }

    @Override
    public Optional<Course> findByIdAndInstructorId(Long id, Long instructorId) {
        return courseRepo.findByIdAndInstructorId(id, instructorId);
    }
}
