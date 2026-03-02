package tn.esprit.microservice.aletheia.entity;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonIgnore; // AJOUTER CET IMPORT

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    // Example: "Projector Epson"

    private String description;

    @Enumerated(EnumType.STRING)
    private ResourceType type;
    // ROOM, EQUIPMENT, HUMAN, SOFTWARE, MATERIAL

    private Integer totalQuantity;
    // Example: 5 projectors

    private Boolean reusable;
    // true = reusable across events
    // false = consumable

    private String location;
    // Optional (room name, storage location)
}