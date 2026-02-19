package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.AssessmentType;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findByType(AssessmentType type);
}
