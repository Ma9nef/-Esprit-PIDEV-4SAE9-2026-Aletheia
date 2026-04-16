package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.service.admin.formation.AdminFormationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @Test
    void shouldReturnAllFormations() {
        Formation formation1 = new Formation();
        formation1.setId(1L);

        Formation formation2 = new Formation();
        formation2.setId(2L);

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
        Formation formation1 = new Formation();
        formation1.setId(1L);
        formation1.setArchived(true);

        Formation formation2 = new Formation();
        formation2.setId(2L);
        formation2.setArchived(true);

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
        Formation formation1 = new Formation();
        formation1.setId(1L);
        formation1.setArchived(false);

        Formation formation2 = new Formation();
        formation2.setId(2L);
        formation2.setArchived(false);

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

        Formation formation = new Formation();
        formation.setId(formationId);
        formation.setArchived(false);

        Formation savedFormation = new Formation();
        savedFormation.setId(formationId);
        savedFormation.setArchived(true);

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

        Formation formation = new Formation();
        formation.setId(formationId);
        formation.setArchived(true);

        Formation savedFormation = new Formation();
        savedFormation.setId(formationId);
        savedFormation.setArchived(false);

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