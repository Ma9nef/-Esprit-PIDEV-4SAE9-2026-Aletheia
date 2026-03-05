import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../event.service';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']

})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  isEditMode = false;
  eventId: number | null = null;
  loading = false;
  statuses = ['PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED'];

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
  }

  initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      location: ['', Validators.required],
      status: ['PLANNED', Validators.required],
      expectedAttendees: ['', [Validators.min(0)]],
      organizer: ['', Validators.required]
    });
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
    if (this.eventForm.invalid) {
      Object.values(this.eventForm.controls).forEach(control => {
        control.markAsTouched();
      });
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
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}