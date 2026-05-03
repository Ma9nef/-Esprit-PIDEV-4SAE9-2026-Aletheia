package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.service.admin.formation.AdminFormationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminFormationServiceImplTest {

    @Mock
    private FormationRepository formationRepository;

    @InjectMocks
    private AdminFormationServiceImpl adminFormationService;

    private Formation createFormation(Long id, boolean archived) {
        Formation f = new Formation();
        ReflectionTestUtils.setField(f, "id", id);
        f.setArchived(archived);
        return f;
    }

    @Test
    void shouldReturnAllFormations() {
        Formation formation1 = createFormation(1L, false);
        Formation formation2 = createFormation(2L, false);

        when(formationRepository.findAll()).thenReturn(List.of(formation1, formation2));

        List<Formation> result = adminFormationService.getAllFormations();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());

        verify(formationRepository).findAll();
    }

    @Test
    void shouldReturnArchivedFormations() {
        Formation formation1 = createFormation(1L, true);
        Formation formation2 = createFormation(2L, true);

        when(formationRepository.findByArchivedTrue()).thenReturn(List.of(formation1, formation2));

        List<Formation> result = adminFormationService.getArchivedFormations();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.get(0).getArchived());
        assertTrue(result.get(1).getArchived());

        verify(formationRepository).findByArchivedTrue();
    }

    @Test
    void shouldReturnActiveFormations() {
        Formation formation1 = createFormation(1L, false);
        Formation formation2 = createFormation(2L, false);

        when(formationRepository.findByArchivedFalse()).thenReturn(List.of(formation1, formation2));

        List<Formation> result = adminFormationService.getActiveFormations();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertFalse(result.get(0).getArchived());
        assertFalse(result.get(1).getArchived());

        verify(formationRepository).findByArchivedFalse();
    }

    @Test
    void shouldArchiveFormationSuccessfully() {
        Long formationId = 1L;

        Formation formation = createFormation(formationId, false);
        Formation savedFormation = createFormation(formationId, true);

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(formation));
        when(formationRepository.save(formation)).thenReturn(savedFormation);

        Formation result = adminFormationService.archiveFormation(formationId);

        assertNotNull(result);
        assertTrue(formation.getArchived());
        assertTrue(result.getArchived());
        assertEquals(formationId, result.getId());

        verify(formationRepository).findById(formationId);
        verify(formationRepository).save(formation);
    }

    @Test
    void shouldThrowExceptionWhenArchiveFormationNotFound() {
        Long formationId = 1L;

        when(formationRepository.findById(formationId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> adminFormationService.archiveFormation(formationId)
        );

        assertEquals("Formation not found with id: 1", exception.getMessage());

        verify(formationRepository).findById(formationId);
        verify(formationRepository, never()).save(any(Formation.class));
    }

    @Test
    void shouldUnarchiveFormationSuccessfully() {
        Long formationId = 1L;

        Formation formation = createFormation(formationId, true);
        Formation savedFormation = createFormation(formationId, false);

        when(formationRepository.findById(formationId)).thenReturn(Optional.of(formation));
        when(formationRepository.save(formation)).thenReturn(savedFormation);

        Formation result = adminFormationService.unarchiveFormation(formationId);

        assertNotNull(result);
        assertFalse(formation.getArchived());
        assertFalse(result.getArchived());
        assertEquals(formationId, result.getId());

        verify(formationRepository).findById(formationId);
        verify(formationRepository).save(formation);
    }

    @Test
    void shouldThrowExceptionWhenUnarchiveFormationNotFound() {
        Long formationId = 1L;

        when(formationRepository.findById(formationId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> adminFormationService.unarchiveFormation(formationId)
        );

        assertEquals("Formation not found with id: 1", exception.getMessage());

        verify(formationRepository).findById(formationId);
        verify(formationRepository, never()).save(any(Formation.class));
    }
}