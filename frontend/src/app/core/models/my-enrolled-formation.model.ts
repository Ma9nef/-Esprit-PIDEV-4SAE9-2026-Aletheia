import { Formation } from './formation.model';

export interface MyEnrolledFormation {
  id: number;
  userId: number;
  status: string;
  enrolledAt: string;
  formation: Formation;
}