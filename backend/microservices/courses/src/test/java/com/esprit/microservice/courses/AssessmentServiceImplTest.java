package com.esprit.microservice.courses;

import com.esprit.microservice.courses.entity.Assessment;
import com.esprit.microservice.courses.entity.QuestionCertif;
import com.esprit.microservice.courses.entity.QuestionOption;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import com.esprit.microservice.courses.service.core.AssessmentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AssessmentServiceImplTest {

    @Mock
    private AssessmentRepository assessmentRepository;

    @InjectMocks
    private AssessmentServiceImpl assessmentService;

    @Test
    void shouldAddAssessmentAndLinkQuestionsAndOptions() {
        // 1. ARRANGE
        Assessment assessment = new Assessment();
        assessment.setTitle("Quiz Java");

        QuestionCertif question = new QuestionCertif();
        // CORRECTION : On utilise .setText() comme défini dans ton entité
        question.setText("C'est quoi un Mock ?");
        question.setPoints(5.0);

        QuestionOption option = new QuestionOption();
        option.setOptionText("Une doublure");

        question.setOptions(new ArrayList<>(List.of(option)));
        assessment.setQuestions(new ArrayList<>(List.of(question)));

        when(assessmentRepository.save(any(Assessment.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. ACT
        Assessment savedAssessment = assessmentService.addAssessment(assessment);

        // 3. ASSERT
        assertNotNull(savedAssessment);
        assertEquals("Quiz Java", savedAssessment.getTitle());

        // Vérification du texte de la question
        assertFalse(savedAssessment.getQuestions().isEmpty());
        assertEquals("C'est quoi un Mock ?", savedAssessment.getQuestions().get(0).getText());

        // Vérification des liens parent-enfant (Logique métier du Service)
        assertEquals(savedAssessment, savedAssessment.getQuestions().get(0).getAssessment());
        assertEquals(question, savedAssessment.getQuestions().get(0).getOptions().get(0).getQuestion());

        verify(assessmentRepository, times(1)).save(assessment);
    }

    @Test
    void shouldUpdateAssessment_Success() {
        // ARRANGE
        Long id = 1L;
        Assessment existing = new Assessment();
        existing.setId(id);
        existing.setQuestions(new ArrayList<>());

        Assessment newData = new Assessment();
        newData.setTitle("Nouveau Titre");

        QuestionCertif newQ = new QuestionCertif();
        // CORRECTION : .setText() ici aussi
        newQ.setText("Question Mise à jour");
        newData.setQuestions(new ArrayList<>(List.of(newQ)));

        when(assessmentRepository.findById(id)).thenReturn(Optional.of(existing));
        when(assessmentRepository.saveAndFlush(any(Assessment.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        Assessment result = assessmentService.updateAssessment(id, newData);

        // ASSERT
        assertEquals("Nouveau Titre", result.getTitle());
        assertEquals("Question Mise à jour", result.getQuestions().get(0).getText());
        verify(assessmentRepository).saveAndFlush(any());
    }

    @Test
    void shouldGetAssessmentById() {
        // ARRANGE
        Assessment assessment = new Assessment();
        assessment.setId(1L);
        when(assessmentRepository.findById(1L)).thenReturn(Optional.of(assessment));

        // ACT
        Assessment result = assessmentService.getAssessmentById(1L);

        // ASSERT
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void shouldThrowExceptionWhenUpdateAssessmentNotFound() {
        // ARRANGE
        Long invalidId = 99L;
        when(assessmentRepository.findById(invalidId)).thenReturn(Optional.empty());

        // ACT & ASSERT
        assertThrows(RuntimeException.class, () -> {
            assessmentService.updateAssessment(invalidId, new Assessment());
        });
    }

    @Test
    void shouldDeleteAssessment() {
        // ARRANGE
        Long id = 1L;
        doNothing().when(assessmentRepository).deleteById(id);

        // ACT
        assessmentService.deleteAssessment(id);

        // ASSERT
        verify(assessmentRepository, times(1)).deleteById(id);
    }
}