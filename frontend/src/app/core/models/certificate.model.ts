export interface Certificate {
  id?: number;
  certificateCode: string;
  issuedAt: string | Date;
  enrollment: {
    id: number;
    course?: { title: string };
    user?: { 
      id?: number;              // unique student identifier (if provided by API)
      nom: string; 
        fullName: string;
      prenom: string; 
      signature?: string; // The Base64 signature string
    };
  };
}