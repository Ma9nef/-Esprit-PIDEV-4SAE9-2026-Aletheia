package com.esprit.microservice.courses;

import com.esprit.microservice.courses.entity.*;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import com.esprit.microservice.courses.repository.SubmissionRepository;
import com.esprit.microservice.courses.service.core.SubmissionServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubmissionServiceImplTest {

    @Mock
    private SubmissionRepository submissionRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @InjectMocks
    private SubmissionServiceImpl submissionService;

    @Test
    void shouldSubmitAndGradeQuiz_CalculatedCorrectScore() {
        // 1. ARRANGE
        Long userId = 1L;
        Long assessmentId = 10L;

        // Création d'un examen avec 1 question et 1 option correcte
        Assessment assessment = new Assessment();
        assessment.setId(assessmentId);
        assessment.setTotalScore(20.0);

        QuestionCertif question = new QuestionCertif();
        QuestionOption correctOption = new QuestionOption();
        correctOption.setId(50L);
        correctOption.setCorrect(true);

        question.setOptions(List.of(correctOption));
        assessment.setQuestions(List.of(question));

        when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(assessment));
        // On simule la sauvegarde et on vérifie l'objet avant qu'il aille en base
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. ACT : L'utilisateur choisit l'ID de l'option correcte (50L)
        Submission result = submissionService.submitAndGradeQuiz(userId, assessmentId, List.of(50L));

        // 3. ASSERT
        assertNotNull(result);
        assertEquals(20.0, result.getScore()); // 1/1 question correcte = 20/20
        assertEquals("Réussi", result.getFeedback());
        assertEquals(SubmissionStatus.GRADED, result.getStatus());
        assertEquals(userId, result.getUserId());

        verify(submissionRepository).save(any(Submission.class));
    }

    @Test
    void shouldFailQuiz_WhenAnswersAreWrong() {
        // ARRANGE
        Assessment assessment = new Assessment();
        assessment.setTotalScore(20.0);

        QuestionCertif q = new QuestionCertif();
        QuestionOption opt = new QuestionOption();
        opt.setId(100L);
        opt.setCorrect(true);
        q.setOptions(List.of(opt));
        assessment.setQuestions(List.of(q));

        when(assessmentRepository.findById(1L)).thenReturn(Optional.of(assessment));
        when(submissionRepository.save(any(Submission.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT : L'utilisateur donne un ID faux (999L au lieu de 100L)
        Submission result = submissionService.submitAndGradeQuiz(1L, 1L, List.of(999L));

        // ASSERT
        assertEquals(0.0, result.getScore());
        assertEquals("Échoué", result.getFeedback());
    }

    @Test
    void shouldThrowException_WhenDeletingNonExistingSubmission() {
        // ARRANGE
        Long id = 1L;
        when(submissionRepository.existsById(id)).thenReturn(false);

        // ACT & ASSERT
        assertThrows(RuntimeException.class, () -> {
            submissionService.deleteById(id);
        });

        verify(submissionRepository, never()).deleteById(anyLong());
    }

    @Test
    void shouldDelete_WhenSubmissionExists() {
        // ARRANGE
        Long id = 1L;
        when(submissionRepository.existsById(id)).thenReturn(true);

        // ACT
        submissionService.deleteById(id);

        // ASSERT
        verify(submissionRepository, times(1)).deleteById(id);
    }
}