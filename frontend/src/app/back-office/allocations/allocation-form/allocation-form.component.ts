import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AllocationService } from '../allocation'; // Correction: allocation.service
import { EventService } from '../../events/event.service';
import { ResourceService } from '../resource.service';
import { Allocation, Event, Resource, RESOURCE_TYPES } from '../allocation.model';

@Component({
  standalone: false,
  selector: 'app-allocation-form',
  templateUrl: './allocation-form.component.html',
  styleUrls: ['./allocation-form.component.css']
})
export class AllocationFormComponent implements OnInit {
  allocationForm!: FormGroup;
  isEditMode = false;
  allocationId: number | null = null;
  loading = false;
  checkingAvailability = false;
  submitted = false;

  events: Event[] = [];
  resources: Resource[] = [];
  filteredResources: Resource[] = [];

  availabilityMessage: string | null = null;
  isAvailable: boolean | null = null;

  resourceTypes = RESOURCE_TYPES;

  // Messages d'erreur
  errorMessages = {
    eventId: '',
    resourceType: '',
    resourceId: '',
    quantityUsed: '',
    startTime: '',
    endTime: '',
    dateRange: '',
    quantityExceeded: ''
  };

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
    this.setupRealTimeValidations();

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
      this.updateQuantityError();
    });

    // Vérifier la quantité quand la ressource ou la quantité change
    this.allocationForm.get('resourceId')?.valueChanges.subscribe(() => {
      this.updateQuantityError();
    });

    this.allocationForm.get('quantityUsed')?.valueChanges.subscribe(() => {
      this.updateQuantityError();
    });

    // Vérifier les dates
    this.allocationForm.get('startTime')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });

    this.allocationForm.get('endTime')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });
  }

  initForm(): void {
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // +1 heure
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // +2 heures

    this.allocationForm = this.fb.group({
      eventId: ['', [Validators.required]],
      resourceType: ['', [Validators.required]],
      resourceId: ['', [Validators.required]],
      quantityUsed: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(1000),
        Validators.pattern(/^[0-9]+$/)
      ]],
      startTime: [this.formatDateTime(startTime), [
        Validators.required,
        this.futureDateTimeValidator
      ]],
      endTime: [this.formatDateTime(endTime), [
        Validators.required,
        this.futureDateTimeValidator
      ]],
      notes: ['']
    }, { validators: [
      this.dateRangeValidator,
      this.minimumDurationValidator,
      this.maximumDurationValidator,
      this.quantityAvailabilityValidator.bind(this)
    ]});
  }

  // Configuration des validations en temps réel
  setupRealTimeValidations(): void {
    // Validation de l'événement
    this.allocationForm.get('eventId')?.valueChanges.subscribe(() => {
      this.updateEventError();
    });

    // Validation du type de ressource
    this.allocationForm.get('resourceType')?.valueChanges.subscribe(() => {
      this.updateResourceTypeError();
    });

    // Validation de la ressource
    this.allocationForm.get('resourceId')?.valueChanges.subscribe(() => {
      this.updateResourceIdError();
    });

    // Validation de la quantité
    this.allocationForm.get('quantityUsed')?.valueChanges.subscribe(() => {
      this.updateQuantityError();
    });

    // Validation des dates
    this.allocationForm.get('startTime')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });

    this.allocationForm.get('endTime')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });
  }

  // Validateurs personnalisés
  futureDateTimeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const inputDate = new Date(control.value);
    const now = new Date();
    
    if (inputDate < now) {
      return { pastDateTime: true };
    }
    return null;
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate <= startDate) {
      return { invalidDateRange: true };
    }
    return null;
  }

  minimumDurationValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
    if (durationInMinutes < 30) {
      return { minimumDuration: true };
    }
    return null;
  }

  maximumDurationValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end = group.get('endTime')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationInHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    if (durationInHours > 24) {
      return { maximumDuration: true };
    }
    return null;
  }

  quantityAvailabilityValidator(group: AbstractControl): ValidationErrors | null {
    const resourceId = group.get('resourceId')?.value;
    const quantity = group.get('quantityUsed')?.value;
    
    if (!resourceId || !quantity) return null;
    
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource && resource.totalQuantity < quantity) {
      return { quantityExceeded: true };
    }
    return null;
  }

  // Mise à jour des messages d'erreur
  updateEventError(): void {
    const control = this.allocationForm.get('eventId');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.eventId = 'Please select an event';
      }
    } else {
      this.errorMessages.eventId = '';
    }
  }

  updateResourceTypeError(): void {
    const control = this.allocationForm.get('resourceType');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.resourceType = 'Please select a resource type';
      }
    } else {
      this.errorMessages.resourceType = '';
    }
  }

  updateResourceIdError(): void {
    const control = this.allocationForm.get('resourceId');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.resourceId = 'Please select a resource';
      }
    } else {
      this.errorMessages.resourceId = '';
    }
  }

  updateQuantityError(): void {
    const control = this.allocationForm.get('quantityUsed');
    const resourceId = this.allocationForm.get('resourceId')?.value;
    const resource = this.resources.find(r => r.id === resourceId);
    
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.quantityUsed = 'Quantity is required';
      } else if (control.errors['min']) {
        this.errorMessages.quantityUsed = 'Quantity must be at least 1';
      } else if (control.errors['max']) {
        this.errorMessages.quantityUsed = 'Quantity cannot exceed 1000';
      } else if (control.errors['pattern']) {
        this.errorMessages.quantityUsed = 'Please enter a valid number';
      }
    } else if (resource && resource.totalQuantity < control?.value) {
      this.errorMessages.quantityUsed = `Maximum available quantity is ${resource.totalQuantity}`;
    } else {
      this.errorMessages.quantityUsed = '';
    }
  }

  updateDateErrors(): void {
    const startControl = this.allocationForm.get('startTime');
    const endControl = this.allocationForm.get('endTime');
    const formErrors = this.allocationForm.errors;

    // Erreurs individuelles
    if (startControl?.errors) {
      if (startControl.errors['required']) {
        this.errorMessages.startTime = 'Start time is required';
      } else if (startControl.errors['pastDateTime']) {
        this.errorMessages.startTime = 'Start time must be in the future';
      }
    } else {
      this.errorMessages.startTime = '';
    }

    if (endControl?.errors) {
      if (endControl.errors['required']) {
        this.errorMessages.endTime = 'End time is required';
      } else if (endControl.errors['pastDateTime']) {
        this.errorMessages.endTime = 'End time must be in the future';
      }
    } else {
      this.errorMessages.endTime = '';
    }

    // Erreurs de groupe
    if (formErrors) {
      if (formErrors['invalidDateRange']) {
        this.errorMessages.dateRange = 'End time must be after start time';
      } else if (formErrors['minimumDuration']) {
        this.errorMessages.dateRange = 'Allocation must last at least 30 minutes';
      } else if (formErrors['maximumDuration']) {
        this.errorMessages.dateRange = 'Allocation cannot exceed 24 hours';
      }
    } else {
      this.errorMessages.dateRange = '';
    }
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
    this.submitted = true;
    
    if (this.allocationForm.invalid) {
      this.markAllFieldsAsTouched();
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
          (result.available ? '✅ Resource available!' : '❌ Resource not available for this period');
        this.checkingAvailability = false;
      },
      error: (error) => {
        console.error('Error checking availability:', error);
        this.availabilityMessage = 'Error checking availability';
        this.checkingAvailability = false;
      }
    });
  }

  markAllFieldsAsTouched(): void {
    Object.values(this.allocationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mettre à jour tous les messages d'erreur
    this.updateEventError();
    this.updateResourceTypeError();
    this.updateResourceIdError();
    this.updateQuantityError();
    this.updateDateErrors();

    if (this.allocationForm.invalid) {
      this.markAllFieldsAsTouched();
      
      // Scroller jusqu'à la première erreur
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    if (!this.isAvailable && !this.isEditMode) {
      alert('Please check resource availability before creating the allocation.');
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
          this.handleApiError(error);
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
          this.handleApiError(error);
        }
      });
    }
  }

  handleApiError(error: any): void {
    if (error.status === 409) {
      alert('This resource is already allocated for the selected period');
    } else if (error.status === 400) {
      alert('Please check all fields and try again');
    } else {
      alert('An error occurred. Please try again later.');
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

  isFieldInvalid(fieldName: string): boolean {
    const field = this.allocationForm.get(fieldName);
    return (field?.invalid && (field?.touched || this.submitted)) || false;
  }

  getSelectedResource(): Resource | null {
    const resourceId = this.allocationForm.get('resourceId')?.value;
    return this.resources.find(r => r.id === resourceId) || null;
  }
}