package com.esprit.microservice.courses;

import com.esprit.microservice.courses.entity.Assessment;
import com.esprit.microservice.courses.entity.QuestionCertif;
import com.esprit.microservice.courses.entity.QuestionOption;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import com.esprit.microservice.courses.repository.QuestionRepository;
import com.esprit.microservice.courses.service.core.QuestionServiceImpl;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class QuestionServiceImplTest {

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private AssessmentRepository assessmentRepository;

    @InjectMocks
    private QuestionServiceImpl questionService;

    @Test
    void shouldAddQuestionAndOptions_Success() {
        // 1. ARRANGE
        Long assessmentId = 1L;
        Assessment mockAssessment = new Assessment();
        mockAssessment.setId(assessmentId);

        QuestionCertif question = new QuestionCertif();
        question.setText("Quelle est la capitale de la France ?");

        QuestionOption option = new QuestionOption();
        option.setOptionText("Paris");
        question.setOptions(new ArrayList<>(List.of(option)));

        Mockito.when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.of(mockAssessment));
        Mockito.when(questionRepository.save(ArgumentMatchers.any(QuestionCertif.class))).thenAnswer(i -> i.getArguments()[0]);

        // 2. ACT
        QuestionCertif result = questionService.addQuestionAndOptions(question, assessmentId);

        // 3. ASSERT
        Assertions.assertNotNull(result);
        Assertions.assertEquals(mockAssessment, result.getAssessment()); // Vérifie le lien avec l'assessment
        Assertions.assertEquals(result, result.getOptions().get(0).getQuestion()); // Vérifie le lien avec l'option
        Mockito.verify(questionRepository, Mockito.times(1)).save(question);
    }

    @Test
    void shouldReturnNull_WhenAssessmentNotFound() {
        // ARRANGE
        Long assessmentId = 99L;
        Mockito.when(assessmentRepository.findById(assessmentId)).thenReturn(Optional.empty());

        // ACT
        QuestionCertif result = questionService.addQuestionAndOptions(new QuestionCertif(), assessmentId);

        // ASSERT
        Assertions.assertNull(result);
        Mockito.verify(questionRepository, Mockito.never()).save(ArgumentMatchers.any());
    }

    @Test
    void shouldUpdateQuestion_Success() {
        // ARRANGE
        Long questionId = 1L;
        QuestionCertif existingQuestion = new QuestionCertif();
        existingQuestion.setId(questionId);
        existingQuestion.setText("Ancienne Question");

        QuestionCertif updatedData = new QuestionCertif();
        updatedData.setText("Nouvelle Question");
        updatedData.setPoints(5.0);

        Mockito.when(questionRepository.findById(questionId)).thenReturn(Optional.of(existingQuestion));
        Mockito.when(questionRepository.save(ArgumentMatchers.any(QuestionCertif.class))).thenAnswer(i -> i.getArguments()[0]);

        // ACT
        QuestionCertif result = questionService.updateQuestion(questionId, updatedData);

        // ASSERT
        Assertions.assertNotNull(result);
        Assertions.assertEquals("Nouvelle Question", result.getText());
        Assertions.assertEquals(5, result.getPoints());
        Mockito.verify(questionRepository).save(existingQuestion);
    }

    @Test
    void shouldDeleteQuestion() {
        // ARRANGE
        Long id = 10L;
        Mockito.doNothing().when(questionRepository).deleteById(id);

        // ACT
        questionService.deleteQuestion(id);

        // ASSERT
        Mockito.verify(questionRepository, Mockito.times(1)).deleteById(id);
    }
}