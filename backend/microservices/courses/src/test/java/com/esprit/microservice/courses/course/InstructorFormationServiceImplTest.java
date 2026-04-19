package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.service.instructor.formations.InstructorFormationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InstructorFormationServiceImplTest {

    @Mock
    private FormationRepository formationRepository;

    @InjectMocks
    private InstructorFormationServiceImpl instructorFormationService;

    @Test
    void shouldCreateFormationSuccessfully() {
        Long instructorId = 5L;

        Formation formation = new Formation();
        formation.setId(99L);
        formation.setTitle("Spring Boot");
        formation.setArchived(false);

        Formation savedFormation = new Formation();
        savedFormation.setId(1L);
        savedFormation.setInstructorId(instructorId);
        savedFormation.setTitle("Spring Boot");
        savedFormation.setArchived(true);

        when(formationRepository.save(formation)).thenReturn(savedFormation);

        Formation result = instructorFormationService.createFormation(formation, instructorId);

        assertNotNull(result);
        assertNull(formation.getId());
        assertEquals(instructorId, formation.getInstructorId());
        assertTrue(formation.getArchived());
        assertEquals(1L, result.getId());
        assertEquals(instructorId, result.getInstructorId());
        assertTrue(result.getArchived());

        verify(formationRepository).save(formation);
    }

    @Test
    void shouldReturnFormationsByInstructor() {
        Long instructorId = 5L;

        Formation formation1 = new Formation();
        formation1.setId(1L);
        formation1.setInstructorId(instructorId);

        Formation formation2 = new Formation();
        formation2.setId(2L);
        formation2.setInstructorId(instructorId);

        when(formationRepository.findByInstructorId(instructorId)).thenReturn(List.of(formation1, formation2));

        List<Formation> result = instructorFormationService.getFormationsByInstructor(instructorId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(instructorId, result.get(0).getInstructorId());
        assertEquals(instructorId, result.get(1).getInstructorId());

        verify(formationRepository).findByInstructorId(instructorId);
    }

    @Test
    void shouldReturnFormationByIdForInstructor() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation formation = new Formation();
        formation.setId(formationId);
        formation.setInstructorId(instructorId);
        formation.setTitle("Java");

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(formation));

        Formation result = instructorFormationService.getFormationByIdForInstructor(formationId, instructorId);

        assertNotNull(result);
        assertEquals(formationId, result.getId());
        assertEquals(instructorId, result.getInstructorId());

        verify(formationRepository).findById(formationId);
    }

    @Test
    void shouldThrowExceptionWhenFormationNotFoundForInstructor() {
        Long formationId = 1L;
        Long instructorId = 5L;

        when(formationRepository.findById(formationId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> instructorFormationService.getFormationByIdForInstructor(formationId, instructorId)
        );

        assertEquals("Formation not found with id: 1", exception.getMessage());

        verify(formationRepository).findById(formationId);
    }

    @Test
    void shouldThrowExceptionWhenInstructorAccessesAnotherFormation() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation formation = new Formation();
        formation.setId(formationId);
        formation.setInstructorId(99L);

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(formation));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> instructorFormationService.getFormationByIdForInstructor(formationId, instructorId)
        );

        assertEquals("You are not allowed to access this formation", exception.getMessage());

        verify(formationRepository).findById(formationId);
    }

    @Test
    void shouldUpdateFormationSuccessfully() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation existingFormation = new Formation();
        existingFormation.setId(formationId);
        existingFormation.setInstructorId(instructorId);
        existingFormation.setTitle("Old title");
        existingFormation.setDescription("Old description");
        existingFormation.setDuration(10);
        existingFormation.setCapacity(20);
        existingFormation.setLocation("Old location");
        existingFormation.setStartDate(LocalDate.of(2026, 4, 1));
        existingFormation.setEndDate(LocalDate.of(2026, 4, 10));
        existingFormation.setLevel("Beginner");
        existingFormation.setObjective("Old objective");
        existingFormation.setPrerequisites("Old prerequisites");

        Formation updatedFormation = new Formation();
        updatedFormation.setTitle("New title");
        updatedFormation.setDescription("New description");
        updatedFormation.setDuration(15);
        updatedFormation.setCapacity(25);
        updatedFormation.setLocation("New location");
        updatedFormation.setStartDate(LocalDate.of(2026, 5, 1));
        updatedFormation.setEndDate(LocalDate.of(2026, 5, 10));
        updatedFormation.setLevel("Intermediate");
        updatedFormation.setObjective("New objective");
        updatedFormation.setPrerequisites("New prerequisites");

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(existingFormation));
        when(formationRepository.save(existingFormation)).thenReturn(existingFormation);

        Formation result = instructorFormationService.updateFormation(formationId, instructorId, updatedFormation);

        assertNotNull(result);
        assertEquals("New title", result.getTitle());
        assertEquals("New description", result.getDescription());
        assertEquals(15, result.getDuration());
        assertEquals(25, result.getCapacity());
        assertEquals("New location", result.getLocation());
        assertEquals(LocalDate.of(2026, 5, 1), result.getStartDate());
        assertEquals(LocalDate.of(2026, 5, 10), result.getEndDate());
        assertEquals("Intermediate", result.getLevel());
        assertEquals("New objective", result.getObjective());
        assertEquals("New prerequisites", result.getPrerequisites());

        verify(formationRepository).findById(formationId);
        verify(formationRepository).save(existingFormation);
    }

    @Test
    void shouldThrowExceptionWhenUpdateFormationNotFound() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation updatedFormation = new Formation();

        when(formationRepository.findById(formationId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> instructorFormationService.updateFormation(formationId, instructorId, updatedFormation)
        );

        assertEquals("Formation not found with id: 1", exception.getMessage());

        verify(formationRepository).findById(formationId);
        verify(formationRepository, never()).save(any(Formation.class));
    }

    @Test
    void shouldThrowExceptionWhenInstructorUpdatesAnotherFormation() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation existingFormation = new Formation();
        existingFormation.setId(formationId);
        existingFormation.setInstructorId(99L);

        Formation updatedFormation = new Formation();
        updatedFormation.setTitle("New title");

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(existingFormation));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> instructorFormationService.updateFormation(formationId, instructorId, updatedFormation)
        );

        assertEquals("You are not allowed to update this formation", exception.getMessage());

        verify(formationRepository).findById(formationId);
        verify(formationRepository, never()).save(any(Formation.class));
    }
}