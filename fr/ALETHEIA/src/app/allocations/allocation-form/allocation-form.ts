// src/app/allocations/allocation-form/allocation-form.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AllocationService } from '../allocation'; // Correction: allocation.service (pas allocation)
import { EventService } from '../../events/event'; // Correction: event.service
import { ResourceService } from '../resource.service';
import { Allocation, Event, Resource, RESOURCE_TYPES } from '../allocation.model';

@Component({
    selector: 'app-allocation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './allocation-form.html',
    styleUrls: ['./allocation-form.css']
})
export class AllocationFormComponent implements OnInit {
    allocationForm!: FormGroup;
    isEditMode = false;
    allocationId: number | null = null;
    loading = false;
    checkingAvailability = false;

    events: Event[] = []; // Type Event[] avec le bon typage
    resources: Resource[] = [];
    filteredResources: Resource[] = [];

    availabilityMessage: string | null = null;
    isAvailable: boolean | null = null;

    resourceTypes = RESOURCE_TYPES;

    constructor(
        private fb: FormBuilder,
        private allocationService: AllocationService,
        private eventService: EventService,
        private resourceService: ResourceService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadEvents();
        this.loadResources();

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.allocationId = +params['id'];
                this.loadAllocation();
            }
        });

        // Filtrer les ressources quand le type change
        this.allocationForm.get('resourceType')?.valueChanges.subscribe(type => {
            this.filterResourcesByType(type);
            this.allocationForm.patchValue({ resourceId: '' });
        });
    }

    initForm(): void {
        const now = new Date();
        const startTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
        const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 heures

        this.allocationForm = this.fb.group({
            eventId: ['', Validators.required],
            resourceType: ['', Validators.required],
            resourceId: ['', Validators.required],
            quantityUsed: [1, [Validators.required, Validators.min(1)]],
            startTime: [this.formatDateTime(startTime), Validators.required],
            endTime: [this.formatDateTime(endTime), Validators.required],
            notes: ['']
        });
    }

    formatDateTime(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    loadEvents(): void {
        this.eventService.getAllEvents().subscribe({
            next: (data) => {
                // Transformer EventResponse[] en Event[]
                this.events = data.map(event => ({
                    id: event.id,
                    title: event.title,
                    description: event.description,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    location: event.location,
                    status: event.status as 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED',
                    expectedAttendees: event.expectedAttendees,
                    organizer: event.organizer
                })).filter(e => e.status !== 'CANCELLED' && e.status !== 'COMPLETED');
            },
            error: (error) => console.error('Error loading events:', error)
        });
    }

    loadResources(): void {
        this.resourceService.getAllResources().subscribe({
            next: (data) => {
                this.resources = data;
                this.filterResourcesByType(this.allocationForm.get('resourceType')?.value);
            },
            error: (error) => console.error('Error loading resources:', error)
        });
    }

    filterResourcesByType(type: string): void {
        if (type) {
            this.filteredResources = this.resources.filter(r => r.type === type);
        } else {
            this.filteredResources = [];
        }
    }

    loadAllocation(): void {
        this.loading = true;
        if (this.allocationId) {
            this.allocationService.getAllocationById(this.allocationId).subscribe({
                next: (allocation) => {
                    this.allocationForm.patchValue({
                        eventId: allocation.event.id,
                        resourceType: allocation.resource.type,
                        resourceId: allocation.resource.id,
                        quantityUsed: allocation.quantityUsed,
                        startTime: allocation.startTime.slice(0, 16),
                        endTime: allocation.endTime.slice(0, 16),
                        notes: allocation.notes
                    });
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading allocation:', error);
                    this.loading = false;
                }
            });
        }
    }

    checkAvailability(): void {
        if (this.allocationForm.invalid) {
            return;
        }

        this.checkingAvailability = true;
        this.availabilityMessage = null;

        const formValue = this.allocationForm.value;
        const allocation: Allocation = {
            event: { id: formValue.eventId },
            resource: { id: formValue.resourceId },
            quantityUsed: formValue.quantityUsed,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            notes: formValue.notes
        };

        if (this.isEditMode && this.allocationId) {
            allocation.id = this.allocationId;
        }

        this.allocationService.checkAvailability(allocation).subscribe({
            next: (result) => {
                this.isAvailable = result.available;
                this.availabilityMessage = result.message ||
                    (result.available ? '✅ Ressource disponible !' : '❌ Ressource non disponible pour cette période');
                this.checkingAvailability = false;
            },
            error: (error) => {
                console.error('Error checking availability:', error);
                this.availabilityMessage = 'Erreur lors de la vérification';
                this.checkingAvailability = false;
            }
        });
    }

    onSubmit(): void {
        if (this.allocationForm.invalid) {
            Object.values(this.allocationForm.controls).forEach(control => {
                control.markAsTouched();
            });
            return;
        }

        if (!this.isAvailable && !this.isEditMode) {
            alert('Veuillez vérifier la disponibilité de la ressource avant de créer l\'allocation.');
            return;
        }

        this.loading = true;
        const formValue = this.allocationForm.value;

        const allocation: Allocation = {
            event: { id: formValue.eventId },
            resource: { id: formValue.resourceId },
            quantityUsed: formValue.quantityUsed,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            notes: formValue.notes
        };

        if (this.isEditMode && this.allocationId) {
            this.allocationService.updateAllocation(this.allocationId, allocation).subscribe({
                next: () => {
                    this.router.navigate(['/allocations']);
                },
                error: (error) => {
                    console.error('Error updating allocation:', error);
                    this.loading = false;
                }
            });
        } else {
            this.allocationService.createAllocation(allocation).subscribe({
                next: () => {
                    this.router.navigate(['/allocations']);
                },
                error: (error) => {
                    console.error('Error creating allocation:', error);
                    this.loading = false;
                }
            });
        }
    }

    cancel(): void {
        this.router.navigate(['/allocations']);
    }

    getResourceTypeLabel(type: string): string {
        const rt = this.resourceTypes.find(r => r.value === type);
        return rt?.label || type;
    }

    getResourceTypeIcon(type: string): string {
        const rt = this.resourceTypes.find(r => r.value === type);
        return rt?.icon || '📌';
    }
}