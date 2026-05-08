export interface Enrollment {
  id: number;
  enrolledAt: string; 
  status: string;
  progress: number;
  user?: {
    id: number;
    fullName: string;
    email?: string;
    signature?: string;
    nom?: string;
    prenom?: string;
  };
  course?: {
    id: number;
    title: string;
    description?: string;
  };
}