import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  standalone: false,
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  loading = false;
  submitted = false;
  statuses = ['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED'];
  
  // Messages d'erreur personnalisés
  errorMessages = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    organizer: '',
    expectedAttendees: '',
    dateRange: ''
  };

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.eventId = +params['id'];
        this.loadEvent();
      }
    });

    // Écouter les changements pour les validations en temps réel
    this.setupRealTimeValidations();
  }

  initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s\-_']+$/) // Alphanumérique + espaces + tirets
      ]],
      description: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]],
      startDate: ['', [
        Validators.required,
        this.futureDateValidator // La date doit être dans le futur
      ]],
      endDate: ['', [
        Validators.required,
        this.futureDateValidator
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      status: ['PLANNED', Validators.required],
      expectedAttendees: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(10000),
        Validators.pattern(/^[0-9]+$/)
      ]],
      organizer: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z\s\-']+$/) // Uniquement lettres, espaces et tirets
      ]]
    }, { 
      validators: [this.dateRangeValidator, this.eventDurationValidator] 
    });
  }

  // Configuration des validations en temps réel
  setupRealTimeValidations(): void {
    // Validation du titre
    this.eventForm.get('title')?.valueChanges.subscribe(() => {
      this.updateTitleError();
    });

    // Validation de la description
    this.eventForm.get('description')?.valueChanges.subscribe(() => {
      this.updateDescriptionError();
    });

    // Validation des dates
    this.eventForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });

    this.eventForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateDateErrors();
    });

    // Validation du lieu
    this.eventForm.get('location')?.valueChanges.subscribe(() => {
      this.updateLocationError();
    });

    // Validation de l'organisateur
    this.eventForm.get('organizer')?.valueChanges.subscribe(() => {
      this.updateOrganizerError();
    });

    // Validation du nombre de participants
    this.eventForm.get('expectedAttendees')?.valueChanges.subscribe(() => {
      this.updateAttendeesError();
    });
  }

  // Validateur personnalisé : date dans le futur
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const inputDate = new Date(control.value);
    const now = new Date();
    
    if (inputDate < now) {
      return { pastDate: true };
    }
    return null;
  }

  // Validateur personnalisé : date de fin après date de début
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (endDate <= startDate) {
      return { invalidDateRange: true };
    }
    return null;
  }

  // Validateur personnalisé : durée maximale de l'événement (7 jours)
  eventDurationValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
    
    if (durationInDays > 7) {
      return { maxDurationExceeded: true };
    }
    return null;
  }

  // Mise à jour des messages d'erreur
  updateTitleError(): void {
    const control = this.eventForm.get('title');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.title = 'Title is required';
      } else if (control.errors['minlength']) {
        this.errorMessages.title = 'Title must be at least 3 characters';
      } else if (control.errors['maxlength']) {
        this.errorMessages.title = 'Title cannot exceed 100 characters';
      } else if (control.errors['pattern']) {
        this.errorMessages.title = 'Title can only contain letters, numbers, spaces, hyphens and underscores';
      }
    } else {
      this.errorMessages.title = '';
    }
  }

  updateDescriptionError(): void {
    const control = this.eventForm.get('description');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.description = 'Description is required';
      } else if (control.errors['minlength']) {
        this.errorMessages.description = 'Description must be at least 10 characters';
      } else if (control.errors['maxlength']) {
        this.errorMessages.description = 'Description cannot exceed 500 characters';
      }
    } else {
      this.errorMessages.description = '';
    }
  }

  updateDateErrors(): void {
    const startControl = this.eventForm.get('startDate');
    const endControl = this.eventForm.get('endDate');
    const formErrors = this.eventForm.errors;

    // Erreurs individuelles
    if (startControl?.errors) {
      if (startControl.errors['required']) {
        this.errorMessages.startDate = 'Start date is required';
      } else if (startControl.errors['pastDate']) {
        this.errorMessages.startDate = 'Start date must be in the future';
      }
    } else {
      this.errorMessages.startDate = '';
    }

    if (endControl?.errors) {
      if (endControl.errors['required']) {
        this.errorMessages.endDate = 'End date is required';
      } else if (endControl.errors['pastDate']) {
        this.errorMessages.endDate = 'End date must be in the future';
      }
    } else {
      this.errorMessages.endDate = '';
    }

    // Erreurs de groupe
    if (formErrors) {
      if (formErrors['invalidDateRange']) {
        this.errorMessages.dateRange = 'End date must be after start date';
      } else if (formErrors['maxDurationExceeded']) {
        this.errorMessages.dateRange = 'Event cannot last more than 7 days';
      }
    } else {
      this.errorMessages.dateRange = '';
    }
  }

  updateLocationError(): void {
    const control = this.eventForm.get('location');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.location = 'Location is required';
      } else if (control.errors['minlength']) {
        this.errorMessages.location = 'Location must be at least 3 characters';
      } else if (control.errors['maxlength']) {
        this.errorMessages.location = 'Location cannot exceed 200 characters';
      }
    } else {
      this.errorMessages.location = '';
    }
  }

  updateOrganizerError(): void {
    const control = this.eventForm.get('organizer');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.organizer = 'Organizer is required';
      } else if (control.errors['minlength']) {
        this.errorMessages.organizer = 'Organizer name must be at least 3 characters';
      } else if (control.errors['maxlength']) {
        this.errorMessages.organizer = 'Organizer name cannot exceed 100 characters';
      } else if (control.errors['pattern']) {
        this.errorMessages.organizer = 'Organizer name can only contain letters, spaces and hyphens';
      }
    } else {
      this.errorMessages.organizer = '';
    }
  }

  updateAttendeesError(): void {
    const control = this.eventForm.get('expectedAttendees');
    if (control?.errors) {
      if (control.errors['required']) {
        this.errorMessages.expectedAttendees = 'Number of attendees is required';
      } else if (control.errors['min']) {
        this.errorMessages.expectedAttendees = 'Must have at least 1 attendee';
      } else if (control.errors['max']) {
        this.errorMessages.expectedAttendees = 'Cannot exceed 10000 attendees';
      } else if (control.errors['pattern']) {
        this.errorMessages.expectedAttendees = 'Please enter a valid number';
      }
    } else {
      this.errorMessages.expectedAttendees = '';
    }
  }

  loadEvent(): void {
    this.loading = true;
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (event) => {
          this.eventForm.patchValue({
            title: event.title,
            description: event.description,
            startDate: event.startDate.slice(0, 16),
            endDate: event.endDate.slice(0, 16),
            location: event.location,
            status: event.status,
            expectedAttendees: event.expectedAttendees,
            organizer: event.organizer
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    
    // Mettre à jour tous les messages d'erreur
    this.updateTitleError();
    this.updateDescriptionError();
    this.updateDateErrors();
    this.updateLocationError();
    this.updateOrganizerError();
    this.updateAttendeesError();

    if (this.eventForm.invalid) {
      // Marquer tous les champs comme touchés
      Object.values(this.eventForm.controls).forEach(control => {
        control.markAsTouched();
      });
      
      // Scroller jusqu'à la première erreur
      const firstError = document.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    this.loading = true;
    const eventData = this.eventForm.value;

    if (this.isEditMode && this.eventId) {
      this.eventService.updateEvent(this.eventId, eventData).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error updating event:', error);
          this.loading = false;
          this.handleApiError(error);
        }
      });
    } else {
      this.eventService.createEvent(eventData).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Error creating event:', error);
          this.loading = false;
          this.handleApiError(error);
        }
      });
    }
  }

  handleApiError(error: any): void {
    // Gérer les erreurs retournées par l'API
    if (error.status === 409) {
      // Conflit - événement déjà existant
      alert('An event with this title and date already exists');
    } else if (error.status === 400) {
      alert('Please check all fields and try again');
    } else {
      alert('An error occurred. Please try again later.');
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }

  // Vérifier si un champ est invalide
  isFieldInvalid(fieldName: string): boolean {
    const field = this.eventForm.get(fieldName);
    return (field?.invalid && (field?.touched || this.submitted)) || false;
  }
}