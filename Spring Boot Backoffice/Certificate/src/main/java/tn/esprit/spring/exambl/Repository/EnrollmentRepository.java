package tn.esprit.spring.exambl.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import tn.esprit.spring.exambl.Entity.Enrollment;

public interface EnrollmentRepository  extends JpaRepository<Enrollment, Long> {

}

