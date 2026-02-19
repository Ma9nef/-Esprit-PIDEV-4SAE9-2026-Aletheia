package tn.esprit.spring.exambl.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certificates")
public class Certificate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime issuedAt;

    @Column(unique = true)
    private String certificateCode;

    // Based on your UML: Certificate connects to Enrollment
    @OneToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;
}