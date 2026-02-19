package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.esprit.spring.exambl.Entity.Question;


public interface QuestionRepository extends JpaRepository<Question, Long> {
}
