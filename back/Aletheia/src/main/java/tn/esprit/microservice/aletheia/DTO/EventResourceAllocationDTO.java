// tn.esprit.microservice.aletheia.dto.EventResourceAllocationDTO.java

package tn.esprit.microservice.aletheia.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResourceAllocationDTO {
    private Long id;
    private Integer quantityUsed;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;

    // Inclure seulement les informations nécessaires de l'événement
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private String eventStatus;
    private LocalDateTime eventStartDate;
    private LocalDateTime eventEndDate;

    // Inclure seulement les informations nécessaires de la ressource
    private Long resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private Integer resourceTotalQuantity;
    private Boolean resourceReusable;
}