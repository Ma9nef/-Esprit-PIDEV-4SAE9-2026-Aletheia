    package com.esprit.microservice.courses.entity;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;

    @Entity
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    @Table(name = "question_options")
    public class QuestionOption {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String optionText;
        @JsonProperty("isCorrect")
        private boolean correct;

        @ManyToOne
        @JoinColumn(name = "question_id")
        @JsonBackReference // Prevents infinite loop
        private QuestionCertif question;


    }