package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.dto.CourseMiniDTO;
import com.esprit.microservice.courses.dto.InstructorCourseRowDTO;
import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.progress.EnrollmentStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

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
        left join Enrollment e
          on e.course.id = c.id
         and e.status = com.esprit.microservice.courses.entity.progress.EnrollmentStatus.ENROLLED
        where c.instructorId = :instructorId
        group by c.id, c.title, c.archived
        order by c.createdAt desc
    """)
    List<InstructorCourseRowDTO> findInstructorCoursesRows(@Param("instructorId") Long instructorId);

    // =========================
    // EXPLORE MENU (category/subCategory en String)
    // =========================

    @Query("""
      select distinct c.category
      from Course c
      where c.archived = false
        and c.category is not null
        and c.category <> ''
      order by c.category asc
    """)
    List<String> findDistinctCategories();

    @Query("""
      select distinct c.subCategory
      from Course c
      where c.archived = false
        and c.category = :category
        and c.subCategory is not null
        and c.subCategory <> ''
      order by c.subCategory asc
    """)
    List<String> findDistinctSubCategories(@Param("category") String category);

    /**
     * Top courses for Explore right column.
     * Note: tri par createdAt desc (vous pouvez changer plus tard).
     */
    @Query("""
      select new com.esprit.microservice.courses.dto.CourseMiniDTO(c.id, c.title)
      from Course c
      where c.archived = false
        and c.category = :category
        and (:subCategory is null or c.subCategory = :subCategory)
      order by c.createdAt desc
    """)
    List<CourseMiniDTO> findTopCoursesForExplore(
            @Param("category") String category,
            @Param("subCategory") String subCategory,
            Pageable pageable
    );

    /**
     * Optionnel: si vous voulez aussi filtrer par topic (3e niveau).
     */
    @Query("""
      select new com.esprit.microservice.courses.dto.CourseMiniDTO(c.id, c.title)
      from Course c
      where c.archived = false
        and c.category = :category
        and (:subCategory is null or c.subCategory = :subCategory)
        and (:topic is null or c.topic = :topic)
      order by c.createdAt desc
    """)
    List<CourseMiniDTO> findTopCoursesForExploreWithTopic(
            @Param("category") String category,
            @Param("subCategory") String subCategory,
            @Param("topic") String topic,
            Pageable pageable
    );
}