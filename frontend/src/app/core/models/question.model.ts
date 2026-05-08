import { QuestionOption } from './QuestionOption';

export interface Question {
  id?: number;
  text: string;
  points: number;
  options: QuestionOption[];
}