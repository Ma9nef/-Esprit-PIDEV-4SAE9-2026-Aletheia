package com.esprit.microservice.events.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class EventStatusTest {

    @Test
    void eventStatus_ShouldHaveCorrectValues() {
        assertThat(EventStatus.PLANNED.name()).isEqualTo("PLANNED");
        assertThat(EventStatus.ONGOING.name()).isEqualTo("ONGOING");
        assertThat(EventStatus.COMPLETED.name()).isEqualTo("COMPLETED");
        assertThat(EventStatus.CANCELLED.name()).isEqualTo("CANCELLED");
        assertThat(EventStatus.IN_PROGRESS.name()).isEqualTo("IN_PROGRESS");
        assertThat(EventStatus.POSTPONED.name()).isEqualTo("POSTPONED");
    }

    @Test
    void eventStatus_ShouldHaveCorrectCount() {
        // L'enum a 6 valeurs selon l'erreur
        assertThat(EventStatus.values()).hasSize(6);
    }
}
