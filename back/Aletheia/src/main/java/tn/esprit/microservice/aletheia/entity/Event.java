package tn.esprit.microservice.aletheia.entity;


import jakarta.persistence.*;
        import lombok.*;
        import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String location;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    private Integer expectedAttendees;
    private String organizer;

    // Relation OneToMany vers EventResourceAllocation
    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<EventResourceAllocation> resourceAllocations = new HashSet<>();

    // Helper method pour ajouter une ressource
    public void allocateResource(Resource resource, int quantity) {
        EventResourceAllocation allocation = new EventResourceAllocation();
        allocation.setEvent(this);
        allocation.setResource(resource);
        allocation.setQuantityUsed(quantity);
        allocation.setStartTime(this.startDate);
        allocation.setEndTime(this.endDate);
        this.resourceAllocations.add(allocation);
    }
}