// src/app/allocations/allocation.model.ts

export interface Resource {
    id: number;
    name: string;
    description?: string;
    type: 'ROOM' | 'EQUIPMENT' | 'HUMAN' | 'SOFTWARE' | 'MATERIAL';
    totalQuantity: number;
    reusable: boolean;
    location?: string;
}

export interface Event {
    id: number;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
    expectedAttendees?: number;
    organizer?: string;
}

export interface Allocation {
    id?: number;
    event: { id: number } | Event;
    resource: { id: number } | Resource;
    quantityUsed: number;
    startTime: string;
    endTime: string;
    notes?: string;
}

// Interface pour la réponse API (structure aplatie)
export interface AllocationResponse {
    id: number;
    eventId: number;
    eventTitle: string;
    eventStartDate: string;
    eventEndDate: string;
    eventLocation: string;
    eventStatus: string;
    resourceId: number;
    resourceName: string;
    resourceType: string;
    resourceLocation: string;
    resourceReusable: boolean;
    resourceTotalQuantity: number;
    quantityUsed: number;
    startTime: string;
    endTime: string;
    notes?: string;
}

// Fonction utilitaire pour convertir AllocationResponse en format avec objets imbriqués
export function toNestedAllocation(response: AllocationResponse): any {
    return {
        id: response.id,
        event: {
            id: response.eventId,
            title: response.eventTitle,
            startDate: response.eventStartDate,
            endDate: response.eventEndDate,
            location: response.eventLocation,
            status: response.eventStatus
        },
        resource: {
            id: response.resourceId,
            name: response.resourceName,
            type: response.resourceType,
            location: response.resourceLocation,
            reusable: response.resourceReusable,
            totalQuantity: response.resourceTotalQuantity
        },
        quantityUsed: response.quantityUsed,
        startTime: response.startTime,
        endTime: response.endTime,
        notes: response.notes
    };
}

export interface AvailabilityCheck {
    available: boolean;
    message?: string;
    conflicts?: AllocationResponse[];
}

export const RESOURCE_TYPES = [
    { value: 'ROOM', label: 'Salle', icon: '🏢', color: '#10439F' },
    { value: 'EQUIPMENT', label: 'Équipement', icon: '⚙️', color: '#874CCC' },
    { value: 'HUMAN', label: 'Ressource Humaine', icon: '👤', color: '#C65BCF' },
    { value: 'SOFTWARE', label: 'Logiciel', icon: '💻', color: '#F27BBD' },
    { value: 'MATERIAL', label: 'Matériel', icon: '📦', color: '#FF9F4B' }
];

export const EVENT_STATUS: { [key: string]: { label: string; class: string; icon: string } } = {
    'PLANNED': { label: 'Planifié', class: 'status-planned', icon: '📅' },
    'ONGOING': { label: 'En cours', class: 'status-ongoing', icon: '▶️' },
    'COMPLETED': { label: 'Terminé', class: 'status-completed', icon: '✅' },
    'CANCELLED': { label: 'Annulé', class: 'status-cancelled', icon: '❌' },
    'POSTPONED': { label: 'Reporté', class: 'status-postponed', icon: '⏰' }
};