package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.dto.InstructorCourseRowDTO;
import com.esprit.microservice.courses.entity.content.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByIdAndArchivedFalse(Long id);
    List<Course> findByArchivedFalse();

    List<Course> findByInstructorId(Long instructorId);
    Optional<Course> findByIdAndInstructorId(Long id, Long instructorId);
    long countByInstructorIdAndArchivedFalse(Long instructorId);
    @Query("""
select new com.esprit.microservice.courses.dto.InstructorCourseRowDTO(
  c.id,
  c.title,
  coalesce(count(e.id), 0),
  c.archived
)
from Course c
left join Enrollment e on e.course.id = c.id and e.status = com.esprit.microservice.courses.entity.progress.EnrollmentStatus.ENROLLED
where c.instructorId = :instructorId
group by c.id, c.title, c.archived
order by c.createdAt desc
""")
    List<InstructorCourseRowDTO> findInstructorCoursesRows(@Param("instructorId") Long instructorId);
}