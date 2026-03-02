// src/app/events/event-list/event-list.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EventService } from '../event'; // Correction: event.service (pas event)
import { EventResponse } from '../event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.css']
})
export class EventListComponent implements OnInit {
  events: EventResponse[] = [];
  filteredEvents: EventResponse[] = [];
  loading = false;
  searchTerm = '';
  selectedStatus = 'ALL';
  statuses = ['ALL', 'PLANNED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED'];
  showDeleteModal = false;
  eventToDelete: number | null = null;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let filtered = this.events;
    
    if (this.selectedStatus !== 'ALL') {
      filtered = filtered.filter(e => e.status === this.selectedStatus);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(e => {
        // Vérification sécurisée pour chaque champ
        const titleMatch = e.title?.toLowerCase().includes(term) || false;
        const locationMatch = e.location?.toLowerCase().includes(term) || false;
        const organizerMatch = e.organizer?.toLowerCase().includes(term) || false;
        
        return titleMatch || locationMatch || organizerMatch;
      });
    }
    
    this.filteredEvents = filtered;
  }

  onSearch(): void {
    this.applyFilter();
  }

  onStatusChange(): void {
    this.applyFilter();
  }

  navigateToCreate(): void {
    this.router.navigate(['/events/new']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/events/edit', id]);
  }

  confirmDelete(id: number): void {
    this.eventToDelete = id;
    this.showDeleteModal = true;
  }

  deleteEvent(): void {
    if (this.eventToDelete) {
      this.eventService.deleteEvent(this.eventToDelete).subscribe({
        next: () => {
          this.loadEvents();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.cancelDelete();
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.eventToDelete = null;
  }

  getStatusClass(status: string): string {
    const classes: {[key: string]: string} = {
      'PLANNED': 'status-planned',
      'ONGOING': 'status-ongoing',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled',
      'POSTPONED': 'status-postponed'
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    const labels: {[key: string]: string} = {
      'PLANNED': 'Planifié',
      'ONGOING': 'En cours',
      'COMPLETED': 'Terminé',
      'CANCELLED': 'Annulé',
      'POSTPONED': 'Reporté'
    };
    return labels[status] || status;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = 'ALL';
    this.applyFilter();
  }
}