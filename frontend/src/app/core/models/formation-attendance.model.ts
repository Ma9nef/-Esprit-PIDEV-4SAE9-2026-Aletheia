export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'NOT_MARKED';

export interface FormationAttendanceSession {
  sessionId: number;
  sessionTitle: string;
  sessionDateTime: string;
  status: AttendanceStatus;
}

export interface FormationAttendanceSummary {
  formationId: number;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  notMarkedCount: number;
  attendanceRate: number;
  sessions: FormationAttendanceSession[];
}