import { Question } from "./question.model";

export interface Assessment {
  id?: number;
  title: string;
  type: string;
  totalScore: number;
  dueDate: string | Date;
  questions?: Question[]; // Include questions here
}