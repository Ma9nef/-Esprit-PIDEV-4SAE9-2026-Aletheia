export type ResourceType = 'ROOM' | 'DEVICE' | 'MATERIAL';
export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number | null;
  metadataJson: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResourceRequest {
  name: string;
  type: ResourceType;
  capacity?: number | null;
  metadata?: Record<string, any>;
}

export interface UpdateResourceRequest {
  name?: string;
  type?: ResourceType;
  capacity?: number | null;
  metadata?: Record<string, any>;
}

export interface Reservation {
  id: string;
  resourceId: string;
  resourceName?: string;
  eventId: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  version: number;
  createdBy: string | null;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationRequest {
  resourceId: string;
  eventId: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCheckRequest {
  resourceId?: string;
  type?: ResourceType;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCheckResponse {
  available: boolean;
  availableResources: Resource[];
  conflictingReservations: Reservation[];
}
