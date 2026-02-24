import { Enrollment } from "./enrollment.model";


export interface Certificate {
  id?: number;
  issuedAt: string; 
   certificateCode: string;
  enrollment?: Enrollment; 
}