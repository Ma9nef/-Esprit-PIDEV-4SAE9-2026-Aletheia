package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.service.instructor.formations.InstructorFormationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

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

    private Formation createFormation(Long id, Long instructorId) {
        Formation f = new Formation();
        ReflectionTestUtils.setField(f, "id", id);
        f.setInstructorId(instructorId);
        return f;
    }

    @Test
    void shouldCreateFormationSuccessfully() {
        Long instructorId = 5L;

        Formation formation = new Formation();
        formation.setTitle("Spring Boot");

        Formation savedFormation = createFormation(1L, instructorId);
        savedFormation.setArchived(true);

        when(formationRepository.save(any(Formation.class))).thenReturn(savedFormation);

        Formation result = instructorFormationService.createFormation(formation, instructorId);

        assertNotNull(result);
        assertNull(formation.getId());
        assertEquals(instructorId, formation.getInstructorId());
        assertTrue(formation.getArchived());
        assertEquals(1L, result.getId());
    }

    @Test
    void shouldReturnFormationsByInstructor() {
        Long instructorId = 5L;

        Formation f1 = createFormation(1L, instructorId);
        Formation f2 = createFormation(2L, instructorId);

        when(formationRepository.findByInstructorId(instructorId)).thenReturn(List.of(f1, f2));

        List<Formation> result = instructorFormationService.getFormationsByInstructor(instructorId);

        assertEquals(2, result.size());
    }

    @Test
    void shouldReturnFormationByIdForInstructor() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation formation = createFormation(formationId, instructorId);

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(formation));

        Formation result = instructorFormationService.getFormationByIdForInstructor(formationId, instructorId);

        assertEquals(formationId, result.getId());
    }

    @Test
    void shouldThrowExceptionWhenFormationNotFoundForInstructor() {
        when(formationRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> instructorFormationService.getFormationByIdForInstructor(1L, 5L));
    }

    @Test
    void shouldThrowExceptionWhenInstructorAccessesAnotherFormation() {
        Formation formation = createFormation(1L, 99L);

        when(formationRepository.findById(1L)).thenReturn(Optional.of(formation));

        assertThrows(RuntimeException.class,
                () -> instructorFormationService.getFormationByIdForInstructor(1L, 5L));
    }

    @Test
    void shouldUpdateFormationSuccessfully() {
        Long formationId = 1L;
        Long instructorId = 5L;

        Formation existing = createFormation(formationId, instructorId);
        existing.setTitle("Old");

        Formation updated = new Formation();
        updated.setTitle("New");

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(existing));
        when(formationRepository.save(existing)).thenReturn(existing);

        Formation result = instructorFormationService.updateFormation(formationId, instructorId, updated);

        assertEquals("New", result.getTitle());
    }

    @Test
    void shouldThrowExceptionWhenUpdateFormationNotFound() {
        when(formationRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> instructorFormationService.updateFormation(1L, 5L, new Formation()));
    }

    @Test
    void shouldThrowExceptionWhenInstructorUpdatesAnotherFormation() {
        Formation existing = createFormation(1L, 99L);

        when(formationRepository.findById(1L)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> instructorFormationService.updateFormation(1L, 5L, new Formation()));
    }
}