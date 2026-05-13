export interface Submission {
  id: number;
  submittedAt: string; // matches 'submitted_at' from DB
  status: string;      // matches 'status' from DB (e.g., GRADED)
  score: number;       // matches 'score' from DB
  feedback: string;    // matches 'feedback' from DB (e.g., Réussi/Échoué)
  user?: { 
    id?: number;
    nom: string;       // matches 'nom' from DB
    prenom: string;    // matches 'prenom' from DB
    fullName?: string;
    signature?: string;
  };
}