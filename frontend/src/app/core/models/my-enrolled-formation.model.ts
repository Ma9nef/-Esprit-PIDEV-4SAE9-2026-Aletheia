export interface MyEnrolledFormation {
    enrollmentId: number;
    status: string;
    enrolledAt: string;
  
    formationId: number;
    instructorId: number;
    title: string;
    description: string;
    duration: number;
    capacity: number;
    archived: boolean;
  }