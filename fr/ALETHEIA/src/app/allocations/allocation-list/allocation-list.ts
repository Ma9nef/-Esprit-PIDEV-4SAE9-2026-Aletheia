// src/app/allocations/allocation-list/allocation-list.component.ts

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AllocationService } from '../allocation'; // Correction: allocation.service
import { RESOURCE_TYPES, EVENT_STATUS } from '../allocation.model';

@Component({
    selector: 'app-allocation-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './allocation-list.html',
    styleUrls: ['./allocation-list.css']
})
export class AllocationListComponent implements OnInit {
    allocations: any[] = [];
    filteredAllocations: any[] = [];
    loading = false;
    searchTerm = '';
    selectedResourceType = 'ALL';
    showDeleteModal = false;
    allocationToDelete: number | null = null;
    showScrollTop = false;
    error: string | null = null;

    resourceTypes = ['ALL', ...RESOURCE_TYPES.map(rt => rt.value)];

    constructor(
        private allocationService: AllocationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadAllocations();
    }

    loadAllocations(): void {
        this.loading = true;
        this.error = null;
        this.allocationService.getAllAllocations().subscribe({
            next: (data) => {
                this.allocations = data;
                this.filteredAllocations = this.allocations;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading allocations:', error);
                this.error = 'Impossible de charger les allocations';
                this.loading = false;
            }
        });
    }

    applyFilter(): void {
        let filtered = this.allocations;

        if (this.selectedResourceType !== 'ALL') {
            filtered = filtered.filter(a => a.resource?.type === this.selectedResourceType);
        }

        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase().trim();
            filtered = filtered.filter(a => {
                const titleMatch = a.event?.title?.toLowerCase().includes(term) || false;
                const resourceMatch = a.resource?.name?.toLowerCase().includes(term) || false;
                const notesMatch = a.notes?.toLowerCase().includes(term) || false;
                return titleMatch || resourceMatch || notesMatch;
            });
        }

        this.filteredAllocations = filtered;
    }

    onSearch(): void {
        this.applyFilter();
    }

    onResourceTypeChange(): void {
        this.applyFilter();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.selectedResourceType = 'ALL';
        this.applyFilter();
    }

    navigateToCreate(): void {
        this.router.navigate(['/allocations/new']);
    }

    navigateToEdit(id: number): void {
        this.router.navigate(['/allocations/edit', id]);
    }

    viewDetails(id: number): void {
        this.router.navigate(['/allocations', id]);
    }

    confirmDelete(id: number): void {
        this.allocationToDelete = id;
        this.showDeleteModal = true;
    }

    deleteAllocation(): void {
        if (this.allocationToDelete) {
            this.allocationService.deleteAllocation(this.allocationToDelete).subscribe({
                next: () => {
                    this.loadAllocations();
                    this.cancelDelete();
                },
                error: (error) => {
                    console.error('Error deleting allocation:', error);
                    this.error = 'Erreur lors de la suppression';
                    this.cancelDelete();
                }
            });
        }
    }

    cancelDelete(): void {
        this.showDeleteModal = false;
        this.allocationToDelete = null;
    }

    getResourceTypeIcon(type: string | undefined): string {
        if (!type) return '📌';
        const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
        return resourceType?.icon || '📌';
    }

    getResourceTypeColor(type: string | undefined): string {
        if (!type) return '#666';
        const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
        return resourceType?.color || '#666';
    }

    getResourceTypeLabel(type: string | undefined): string {
        if (!type) return 'Inconnu';
        const resourceType = RESOURCE_TYPES.find(rt => rt.value === type);
        return resourceType?.label || type;
    }

    getStatusInfo(status: string | undefined): { label: string; class: string; icon: string } {
        if (!status) return { label: 'Inconnu', class: 'status-unknown', icon: '❓' };
        return EVENT_STATUS[status] || {
            label: status,
            class: 'status-unknown',
            icon: '❓'
        };
    }

    getUniqueResourcesCount(): number {
        return new Set(this.allocations.map(a => a.resource?.id).filter(id => id !== undefined)).size;
    }

    getUniqueEventsCount(): number {
        return new Set(this.allocations.map(a => a.event?.id).filter(id => id !== undefined)).size;
    }

    calculateDuration(allocation: any): string {
        try {
            const start = new Date(allocation.startTime);
            const end = new Date(allocation.endTime);
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

    formatDateTime(date: string): string {
        try {
            return new Date(date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date invalide';
        }
    }

    @HostListener('window:scroll')
    onWindowScroll() {
        this.showScrollTop = window.scrollY > 300;
    }

    scrollToTop(): void {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}