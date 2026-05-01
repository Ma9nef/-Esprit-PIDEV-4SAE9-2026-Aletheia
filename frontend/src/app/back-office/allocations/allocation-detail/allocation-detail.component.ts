
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AllocationService } from '../allocation'; // Correction: allocation.service
import { RESOURCE_TYPES, EVENT_STATUS } from '../allocation.model';

@Component({
  standalone: false,
  selector: 'app-allocation-detail',
  templateUrl: './allocation-detail.component.html',
  styleUrls: ['./allocation-detail.component.css']
})
export class AllocationDetailComponent  implements OnInit {
    allocation: any = null; // Changé de AllocationResponse à any
    loading = false;
    error: string | null = null;
    showDeleteModal = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private allocationService: AllocationService
    ) {}

    ngOnInit(): void {
        this.loadAllocation();
    }

    loadAllocation(): void {
        this.loading = true;
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.allocationService.getAllocationById(+id).subscribe({
                next: (data) => {
                    this.allocation = data;
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading allocation:', error);
                    this.error = 'Impossible de charger les détails de l\'allocation';
                    this.loading = false;
                }
            });
        }
    }

    goToEdit(): void {
        if (this.allocation) {
            this.router.navigate(['/allocations/edit', this.allocation.id]);
        }
    }

    confirmDelete(): void {
        this.showDeleteModal = true;
    }

    deleteAllocation(): void {
        if (this.allocation) {
            this.allocationService.deleteAllocation(this.allocation.id).subscribe({
                next: () => {
                    this.router.navigate(['/allocations']);
                },
                error: (error) => {
                    console.error('Error deleting allocation:', error);
                    this.error = 'Erreur lors de la suppression';
                    this.showDeleteModal = false;
                }
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
    }

    goBack(): void {
        this.router.navigate(['/allocations']);
    }

    getResourceTypeInfo(type: string) {
        return RESOURCE_TYPES.find(rt => rt.value === type) || {
            icon: '📌',
            color: '#666',
            label: type || 'Inconnu'
        };
    }

    getStatusInfo(status: string): { label: string; class: string; icon: string } {
        if (!status) return { label: 'Inconnu', class: 'status-unknown', icon: '❓' };
        return EVENT_STATUS[status] || {
            label: status,
            class: 'status-unknown',
            icon: '❓'
        };
    }

    formatDate(date: string): string {
        if (!date) return 'Date non disponible';
        try {
            return new Date(date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date invalide';
        }
    }

    formatDateTime(date: string): string {
        if (!date) return 'Date non disponible';
        try {
            return new Date(date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date invalide';
        }
    }

    calculateDuration(): string {
        if (!this.allocation) return '';

        try {
            const start = new Date(this.allocation.startTime);
            const end = new Date(this.allocation.endTime);
            const diffMs = end.getTime() - start.getTime();
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (diffHrs > 24) {
                const days = Math.floor(diffHrs / 24);
                const hours = diffHrs % 24;
                return `${days}j ${hours}h ${diffMins}min`;
            }

            return `${diffHrs}h ${diffMins}min`;
        } catch {
            return 'Durée inconnue';
        }
    }

    // Méthode utilitaire pour vérifier si une propriété existe
    hasProperty(obj: any, prop: string): boolean {
        return obj && obj[prop] !== undefined && obj[prop] !== null;
    }
}
