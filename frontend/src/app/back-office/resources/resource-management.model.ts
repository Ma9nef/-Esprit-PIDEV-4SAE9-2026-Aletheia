// ── Local helper types ────────────────────────────────────────────────────────

export interface RoomMapLocation {
  lat: number;
  lng: number;
  zoom?: number;
}

// ── Enums / Literal Types ────────────────────────────────────────────────────

export type ResourceType =
  | 'CLASSROOM'
  | 'COMPUTER_LAB'
  | 'AMPHITHEATER'
  | 'PROJECTOR'
  | 'LAPTOP'
  | 'SMARTBOARD'
  | 'CUSTOM_EQUIPMENT';

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type MaintenanceStatus =
  | 'OPERATIONAL'
  | 'UNDER_MAINTENANCE'
  | 'OUT_OF_SERVICE';

export type WaitlistStatus =
  | 'WAITING'
  | 'NOTIFIED'
  | 'EXPIRED'
  | 'CONVERTED';

export type SessionType = 'LECTURE' | 'LAB' | 'EXAM' | 'WORKSHOP';

export type RecurrencePattern = 'WEEKLY' | 'BIWEEKLY';

export type SwapRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

// ── Resource ─────────────────────────────────────────────────────────────────

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number | null;
  description: string | null;
  location: string | null;
  requiresApproval: boolean;
  conditionScore: number;
  maintenanceStatus: MaintenanceStatus;
  maxReservationHours: number | null;
  minAdvanceBookingHours: number | null;
  attributes: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequest {
  name: string;
  type: ResourceType;
  capacity?: number | null;
  description?: string | null;
  location?: string | null;
  requiresApproval?: boolean;
  conditionScore?: number;
  maxReservationHours?: number | null;
  minAdvanceBookingHours?: number | null;
  attributes?: Record<string, any>;
}

export interface UpdateResourceRequest {
  name?: string;
  type?: ResourceType;
  capacity?: number | null;
  description?: string | null;
  location?: string | null;
  requiresApproval?: boolean;
  conditionScore?: number;
  maintenanceStatus?: MaintenanceStatus;
  maxReservationHours?: number | null;
  minAdvanceBookingHours?: number | null;
  attributes?: Record<string, any>;
}

// ── Teaching Session ──────────────────────────────────────────────────────────

export interface TeachingSession {
  id: string;
  title: string;
  courseCode: string | null;
  instructorId: string;
  module: string | null;
  expectedAttendees: number | null;
  sessionType: SessionType;
  createdAt: string;
}

export interface CreateTeachingSessionRequest {
  title: string;
  courseCode?: string;
  module?: string;
  expectedAttendees?: number;
  sessionType: SessionType;
}

// ── Reservation ──────────────────────────────────────────────────────────────

export interface Reservation {
  id: string;
  resourceId: string;
  resourceName: string | null;
  resourceLocation: string | null;
  teachingSessionId: string | null;
  sessionTitle: string | null;
  courseCode: string | null;
  instructorId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  recurrenceGroupId: string | null;
  qrCodeToken: string | null;
  checkedInAt: string | null;
  noShow: boolean;
  rejectionReason: string | null;
  cancellationReason: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface CreateReservationRequest {
  resourceId: string;
  teachingSessionId: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface CreateRecurrenceReservationRequest {
  resourceId: string;
  teachingSessionId: string;
  pattern: RecurrencePattern;
  dayOfWeek: string;      // DayOfWeek enum: MONDAY..SUNDAY
  slotStartTime: string;  // HH:mm:ss
  slotEndTime: string;    // HH:mm:ss
  endDate: string;        // ISO date yyyy-MM-dd
}

export interface RecurrenceBookingResult {
  groupId: string;
  bookedSlots: Reservation[];
  skippedSlots: Array<{ date: string; reason: string }>;
  totalAttempted: number;
  totalBooked: number;
}

// ── Availability ─────────────────────────────────────────────────────────────

export interface CheckAvailabilityRequest {
  resourceId?: string;
  type?: ResourceType;
  startTime: string;
  endTime: string;
  minCapacity?: number;
}

export interface AvailabilityResponse {
  available: boolean;
  nextFreeWindow: string | null;
  availableResources: Resource[];
  suggestions: Array<{
    resource: Resource;
    reason: string;
    score: number;
  }>;
}

// ── Maintenance Window ────────────────────────────────────────────────────────

export interface MaintenanceWindow {
  id: string;
  resourceId: string;
  title: string;
  startTime: string;
  endTime: string;
  notes: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface CreateMaintenanceWindowRequest {
  resourceId: string;
  title: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

// ── Waitlist ─────────────────────────────────────────────────────────────────

export interface WaitlistEntry {
  id: string;
  resourceId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  position: number;
  status: WaitlistStatus;
  notifiedAt: string | null;
  createdAt: string;
}

export interface CreateWaitlistRequest {
  resourceId: string;
  startTime: string;
  endTime: string;
}

// ── Swap Request ──────────────────────────────────────────────────────────────

export interface SwapRequest {
  id: string;
  requesterId: string;
  targetId: string;
  requesterReservationId: string;
  targetReservationId: string;
  status: SwapRequestStatus;
  requesterNote: string | null;
  responseNote: string | null;
  expiresAt: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface CreateSwapRequest {
  targetReservationId: string;
  note?: string;
}

// ── Check-In ──────────────────────────────────────────────────────────────────

export interface CheckInEvent {
  id: string;
  reservationId: string;
  scannedAt: string;
  tokenUsed: string;
  valid: boolean;
  createdAt: string;
}

export interface ScanTokenRequest {
  token: string;
}

// ── Instructor Profile ────────────────────────────────────────────────────────

export interface InstructorProfile {
  instructorId: string;
  reputationScore: number;
  totalReservations: number;
  noShowCount: number;
  lateCancellationCount: number;
  isTrusted: boolean;
  lastUpdated: string;
}

export interface AdjustScoreRequest {
  delta: number;
  reason?: string;
}

// ── Statistics ───────────────────────────────────────────────────────────────

export interface ResourceStatistics {
  resourceId: string;
  resourceName: string;
  totalReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  pendingReservations: number;
  utilizationPercentage: number;
  averageReservationDurationHours: number;
  totalReservationHours: number;
  reservationsByDayOfWeek: Record<string, number>;
  peakHours: Record<string, number>;
  periodStart: string;
  periodEnd: string;
}
