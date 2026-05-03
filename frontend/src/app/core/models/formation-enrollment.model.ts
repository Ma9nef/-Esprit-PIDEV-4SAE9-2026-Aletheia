import { Formation } from './formation.model';

export interface FormationEnrollment {
  id: number;
  userId: number;
  formation: Formation;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  enrolledAt: string;
}