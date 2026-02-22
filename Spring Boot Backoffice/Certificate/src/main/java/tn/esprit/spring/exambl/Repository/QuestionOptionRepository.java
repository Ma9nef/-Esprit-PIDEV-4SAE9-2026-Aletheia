package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.esprit.spring.exambl.Entity.QuestionOption;

public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
}
