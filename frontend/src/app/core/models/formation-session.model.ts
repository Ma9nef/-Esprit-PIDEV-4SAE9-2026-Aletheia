export interface FormationSession {
  id?: number;
  formationId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  topic: string;
}