// src/app/front-office/models/event.model.ts
export interface AppEvent {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS' | 'POSTPONED';
  expectedAttendees: number;
  organizer: string;
}