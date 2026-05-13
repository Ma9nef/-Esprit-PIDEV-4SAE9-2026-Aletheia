package com.esprit.microservice.courses.entity;

import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

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
    @JsonFormat(pattern = "yyyy-MM-dd")

    private LocalDate issuedAt;

    @Column(unique = true)
    private String certificateCode;

    // Based on your UML: Certificate connects to Enrollment
    @OneToOne
    @JoinColumn(name = "enrollment_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "certificate"})
    private Enrollment enrollment;
    @Lob
    @Column(columnDefinition = "LONGBLOB") // Use LONGBLOB for PDFs
    private byte[] pdfContent;
}