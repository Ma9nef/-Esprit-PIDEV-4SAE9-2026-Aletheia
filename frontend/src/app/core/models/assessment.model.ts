import { Question } from "./question.model";

export interface Assessment {
  id?: number;
  title: string;
  type: string;
  totalScore: number;
  dueDate: string | Date;
  questions?: Question[];
     course?: { id: number; title?: string; description?: string };
  courseId?: number;                       // Allows accessing data.courseId
  course_id?: number;  // Include questions here
}