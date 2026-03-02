package tn.esprit.microservice.aletheia.entity;


import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore; // Ajouter cet import

@Entity
@Table(name = "event_resource_allocations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResourceAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore  // ← AJOUTER CETTE ANNOTATION
    private Event event;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    @JsonIgnore  // ← AJOUTER CETTE ANNOTATION
    private Resource resource;  // Référence à Resource sans modifier la classe

    private Integer quantityUsed;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;
}