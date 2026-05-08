export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'LEARNER';
  phone?: string;
  photoUrl?: string;
  bio?: string;
  signature?: string;
}
