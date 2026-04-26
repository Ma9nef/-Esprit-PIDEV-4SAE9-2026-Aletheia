package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.client.ProductClient;
import com.esprit.microservice.courses.dto.ProductDTO;
import com.esprit.microservice.courses.dto.training.FormationDetailsDTO;
import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerFormationServiceImpl implements LearnerFormationService {

    private final FormationRepository formationRepository;
    private final ProductClient productClient;

    public LearnerFormationServiceImpl(FormationRepository formationRepository,
                                       ProductClient productClient) {
        this.formationRepository = formationRepository;
        this.productClient = productClient;
    }

    @Override
    public List<FormationDetailsDTO> getAllAvailableFormations() {
        return formationRepository.findByArchivedFalse()
                .stream()
                .map(this::mapToDetailsDTO)
                .toList();
    }

    @Override
    public FormationDetailsDTO getAvailableFormationById(Long id) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + id));

        if (Boolean.TRUE.equals(formation.getArchived())) {
            throw new RuntimeException("Formation is not available");
        }

        return mapToDetailsDTO(formation);
    }

    private FormationDetailsDTO mapToDetailsDTO(Formation formation) {
        FormationDetailsDTO dto = new FormationDetailsDTO();

        dto.setId(formation.getId());
        dto.setInstructorId(formation.getInstructorId());
        dto.setTitle(formation.getTitle());
        dto.setDescription(formation.getDescription());
        dto.setDuration(formation.getDuration());
        dto.setCapacity(formation.getCapacity());
        dto.setArchived(formation.getArchived());
        dto.setLocation(formation.getLocation());
        dto.setStartDate(formation.getStartDate());
        dto.setEndDate(formation.getEndDate());
        dto.setLevel(formation.getLevel());
        dto.setObjective(formation.getObjective());
        dto.setPrerequisites(formation.getPrerequisites());
        dto.setProductId(formation.getProductId());

        if (formation.getProductId() != null) {
            ProductDTO product = productClient.getProductById(formation.getProductId());

            if (product != null) {
                dto.setProductTitle(product.getTitle());
                dto.setProductDescription(product.getDescription());
                dto.setProductAuthor(product.getAuthor());
                dto.setProductType(product.getType().name());
                dto.setProductPrice(product.getPrice());
                dto.setProductFileUrl(product.getFileUrl());
                dto.setProductCoverImageUrl(product.getCoverImageUrl());
            }
        }

        return dto;
    }
}