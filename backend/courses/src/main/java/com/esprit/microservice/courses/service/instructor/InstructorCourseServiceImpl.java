package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.command.CourseCreateDTO;
import com.esprit.microservice.courses.dto.course.command.CourseUpdateDTO;
import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.core.CourseCoreService;
import com.esprit.microservice.courses.service.mapper.CourseMapper;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructorCourseServiceImpl implements InstructorCourseService {

    private final CourseCoreService core;
    private final CourseMapper mapper;
    private final JwtReader jwtReader;

    public InstructorCourseServiceImpl(CourseCoreService core, CourseMapper mapper, JwtReader jwtReader) {
        this.core = core;
        this.mapper = mapper;
        this.jwtReader = jwtReader;
    }

    @Override
    public CourseAdminDTO create(String bearer, CourseCreateDTO dto) {
        enforceInstructorRole(bearer);
        jwtReader.debugClaims(bearer);

        Long instructorId = jwtReader.extractUserId(bearer);
        if (instructorId == null) {
            throw new AccessDeniedException("JWT missing user id claim (id/userId/sub)");
        }

        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());

        // ✅ IMPORTANT: persist ownership
        course.setInstructorId(instructorId);

        String nameFromJwt = jwtReader.extractName(bearer);
        course.setInstructorName(nameFromJwt != null ? nameFromJwt : dto.getInstructorName());

        course.setPrice(dto.getPrice());
        course.setDurationHours(dto.getDurationHours());

        course.setArchived(true);

        System.out.println("About to save course, instructorId=" + course.getInstructorId());
        if (course.getInstructorId() == null) {
            throw new AccessDeniedException("instructorId is null before save (should never happen)");
        }

        return mapper.toAdminDTO(core.save(course));
    }

    @Override
    public CourseAdminDTO update(String bearer, Long id, CourseUpdateDTO dto) {
        enforceInstructorRole(bearer);

        Long instructorId = jwtReader.extractUserId(bearer);

        Course course = core.findByIdAndInstructorId(id, instructorId)
                .orElseThrow(() -> new AccessDeniedException("Course not found or not yours: " + id));

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setInstructorName(dto.getInstructorName());
        course.setPrice(dto.getPrice());
        course.setDurationHours(dto.getDurationHours());

        // toute modif => revalidation
        course.setArchived(true);

        return mapper.toAdminDTO(core.save(course));
    }

    @Override
    public Optional<CourseAdminDTO> getMine(String bearer, Long id) {
        enforceInstructorRole(bearer);

        Long instructorId = jwtReader.extractUserId(bearer);
        return core.findByIdAndInstructorId(id, instructorId).map(mapper::toAdminDTO);
    }

    @Override
    public List<CourseAdminDTO> listMine(String bearer) {
        enforceInstructorRole(bearer);

        Long instructorId = jwtReader.extractUserId(bearer);
        return core.findByInstructorId(instructorId).stream()
                .map(mapper::toAdminDTO)
                .toList();
    }

    private void enforceInstructorRole(String bearer) {
         String role = jwtReader.extractRole(bearer); // à implémenter dans JwtReader
         if (!"INSTRUCTOR".equals(role)) {
             throw new AccessDeniedException("Forbidden");
         }
     }
}