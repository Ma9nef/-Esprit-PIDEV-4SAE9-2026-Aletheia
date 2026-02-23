    package tn.esprit.spring.exambl.Entity;

    import com.fasterxml.jackson.annotation.JsonBackReference;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonProperty;
    import jakarta.persistence.*;
    import lombok.*;

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
        private Question question;
    }