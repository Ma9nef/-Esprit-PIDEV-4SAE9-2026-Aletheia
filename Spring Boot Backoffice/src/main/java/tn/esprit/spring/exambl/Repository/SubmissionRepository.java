package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.spring.exambl.Entity.QuestionOption;
import tn.esprit.spring.exambl.Entity.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
}
