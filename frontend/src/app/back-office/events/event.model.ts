// src/app/events/event.model.ts

export interface Event {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
    expectedAttendees?: number;
    organizer?: string;
}

export interface EventResponse {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location: string;
    status: string; // Moins strict pour la réponse API
    expectedAttendees?: number;
    organizer?: string;
}