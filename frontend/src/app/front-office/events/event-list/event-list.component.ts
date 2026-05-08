// src/app/front-office/events/event-list/event-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventService } from '../../service/event.service';
import { RecommendationService } from '../../service/recommendation.service';
import { AppEvent } from '../../models/event.model';
import { RecommendedEvent } from '../../models/recommendation.model';
import { finalize, catchError, of, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: false
})
export class EventListComponente implements OnInit {
  events: AppEvent[] = [];
  recommendedEvents: RecommendedEvent[] = [];
  filteredEvents: AppEvent[] = [];
  loading = false;
  showRecommendations = false;
  currentUserId = 1;
  searchTerm = '';
  selectedStatus = '';
  apiError = false;
  errorMessage = '';
  loadingRecommendations = false;
  predictionProgress = 0;
  predictionTotal = 0;
  private isLoadingEvents = false;

  constructor(
    private eventService: EventService,
    private recommendationService: RecommendationService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.apiError = false;
    this.isLoadingEvents = true;
    
    this.eventService.getAllEvents()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.isLoadingEvents = false;
        }),
        catchError(error => {
          console.error('Error loading events:', error);
          this.apiError = true;
          this.errorMessage = 'Impossible de charger les événements. Vérifiez que le backend est démarré.';
          return of([]);
        })
      )
      .subscribe({
        next: (events) => {
          if (events && events.length > 0) {
            this.events = events;
            this.filteredEvents = events;
            console.log(`📋 ${this.events.length} événements chargés depuis l'API`);
            
            // Si les recommandations étaient déjà activées avant le chargement, les charger
            if (this.showRecommendations) {
              this.loadRecommendations();
            }
          } else {
            console.log('⚠️ Aucun événement trouvé dans l\'API, chargement des données mockées');
            this.loadMockEvents();
          }
        }
      });
  }

  /**
   * Charge les événements FILTRÉS et prédit les scores pour chacun
   * Puis affiche les 6 meilleurs
   */
  loadRecommendations(): void {
    if (!this.showRecommendations) {
      console.log('📴 Recommandations désactivées');
      return;
    }
    
    // Vérifier si les événements filtrés sont disponibles
    if (this.filteredEvents.length === 0) {
      console.log('⏳ En attente du chargement des événements filtrés...');
      // Attendre que les événements soient chargés
      const checkInterval = setInterval(() => {
        if (this.filteredEvents.length > 0 || !this.isLoadingEvents) {
          clearInterval(checkInterval);
          if (this.filteredEvents.length > 0) {
            this.loadRecommendations();
          } else {
            console.log('❌ Impossible de charger les événements pour les recommandations');
            this.recommendedEvents = this.getFallbackRecommendations();
            this.loadingRecommendations = false;
          }
        }
      }, 500);
      return;
    }
    
    this.loadingRecommendations = true;
    // Utiliser filteredEvents au lieu de events
    this.predictionTotal = this.filteredEvents.length;
    this.predictionProgress = 0;
    
    console.log(`🎯 === DÉBUT DES PRÉDICTIONS ===`);
    console.log(`🎯 Utilisateur ID: ${this.currentUserId}`);
    console.log(`🎯 Événements à analyser: ${this.filteredEvents.length} (événements filtrés)`);
    console.log(`🎯 Filtres actifs: Search="${this.searchTerm}", Status="${this.selectedStatus}"`);
    console.log(`🎯 Affichage des ${Math.min(6, this.filteredEvents.length)} meilleurs résultats`);
    
    // Afficher la liste des événements à analyser
    console.log('\n📋 LISTE DES ÉVÉNEMENTS À ANALYSER:');
    this.filteredEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} - ${event.status} - ${event.location}`);
    });
    
    // Créer un tableau d'observables pour chaque prédiction sur les événements FILTRÉS
    const predictionObservables = this.filteredEvents.map(event => 
      this.recommendationService.getPredictions(this.currentUserId, event.id, 'CLICK', 'Conference').pipe(
        map(prediction => ({
          event: event,
          score: prediction.score,
          willLike: prediction.will_like,
          confidence: prediction.confidence
        })),
        tap(() => {
          this.predictionProgress++;
          console.log(`📊 Progression: ${this.predictionProgress}/${this.predictionTotal}`);
        })
      )
    );
    
    // Exécuter toutes les prédictions en parallèle
    forkJoin(predictionObservables).pipe(
      finalize(() => {
        this.loadingRecommendations = false;
        console.log(`🏁 === FIN DES PRÉDICTIONS ===`);
      }),
      catchError(error => {
        console.error('❌ Erreur lors des prédictions:', error);
        return of([]);
      })
    ).subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          // Filtrer et trier par score décroissant
          const sortedResults = results
            .filter(result => result.score > 0.2) // Garder les scores > 20%
            .sort((a, b) => b.score - a.score);
          
          console.log(`\n📊 ${sortedResults.length} événements avec score > 20% (sur ${results.length} analysés)`);
          
          // Afficher tous les scores dans la console
          console.log('\n📈 CLASSEMENT COMPLET DES ÉVÉNEMENTS FILTRÉS:');
          sortedResults.forEach((result, index) => {
            const scorePercent = (result.score * 100).toFixed(1);
            const willLikeIcon = result.willLike ? '✅' : '❌';
            console.log(`  ${index + 1}. ${willLikeIcon} ${result.event.title} - Score: ${scorePercent}% (Confiance: ${(result.confidence * 100).toFixed(0)}%)`);
          });
          
          // Prendre les 6 meilleurs
          const topResults = sortedResults.slice(0, 6);
          
          console.log(`\n🎉 TOP ${topResults.length} RECOMMANDATIONS (parmi les événements filtrés):`);
          topResults.forEach((result, index) => {
            const scorePercent = (result.score * 100).toFixed(1);
            console.log(`  ${index + 1}. ${result.event.title} - ${scorePercent}% match`);
          });
          
          // Créer les événements recommandés avec leurs scores
          this.recommendedEvents = topResults.map((result) => ({
            ...result.event,
            recommendationScore: Math.round(result.score * 100),
            willLike: result.willLike
          }));
          
        } else {
          console.log('⚠️ Aucun résultat de prédiction, utilisation du fallback');
          this.recommendedEvents = this.getFallbackRecommendations();
        }
      },
      error: (error) => {
        console.error('❌ Erreur fatale:', error);
        this.recommendedEvents = this.getFallbackRecommendations();
      }
    });
  }

  /**
   * Mettre à jour les recommandations quand les filtres changent
   */
  updateRecommendationsForFilteredEvents(): void {
    if (this.showRecommendations && this.filteredEvents.length > 0) {
      console.log('🔄 Mise à jour des recommandations après changement de filtres...');
      this.loadRecommendations();
    }
  }

  /**
   * Fallback: recommandations basées sur des critères simples
   */
  private getFallbackRecommendations(): RecommendedEvent[] {
    console.log('📋 Génération de recommandations fallback (basées sur la popularité)');
    
    if (this.filteredEvents.length === 0) {
      return [];
    }
    
    // Trier les événements filtrés par popularité (expectedAttendees) et date
    const sortedEvents = [...this.filteredEvents].sort((a, b) => {
      // Priorité aux événements avec plus de participants
      if (a.expectedAttendees !== b.expectedAttendees) {
        return b.expectedAttendees - a.expectedAttendees;
      }
      // Puis par date (les plus proches d'abord)
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
    
    const topEvents = sortedEvents.slice(0, 6);
    
    console.log(`📋 Top 6 événements fallback (parmi les événements filtrés):`);
    topEvents.forEach((event, index) => {
      console.log(`  ${index + 1}. ${event.title} - ${event.expectedAttendees} participants`);
    });
    
    return topEvents.map((event, index) => ({
      ...event,
      recommendationScore: Math.max(85 - (index * 5), 60),
      willLike: true
    }));
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = this.searchTerm === '' || 
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = this.selectedStatus === '' || 
        event.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
    
    console.log(`🔍 Filtrage: ${this.events.length} → ${this.filteredEvents.length} événements`);
    
    // Mettre à jour les recommandations si elles sont actives
    if (this.showRecommendations) {
      this.updateRecommendationsForFilteredEvents();
    }
  }

  onSearchChange(): void {
    this.filterEvents();
  }

  onStatusChange(): void {
    this.filterEvents();
  }

  toggleRecommendations(): void {
    console.log(`🎯 Toggle recommendations: ${!this.showRecommendations}`);
    this.showRecommendations = !this.showRecommendations;
    
    if (this.showRecommendations) {
      if (this.filteredEvents.length > 0) {
        // Utiliser les événements déjà filtrés
        this.loadRecommendations();
      } else if (!this.isLoadingEvents) {
        // Événements non encore chargés, les charger d'abord
        console.log('📋 Chargement des événements avant recommandations...');
        this.loadEvents();
      }
    } else {
      // Cache les recommandations
      this.recommendedEvents = [];
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PLANNED': return 'planned';
      case 'ONGOING': return 'ongoing';
      case 'COMPLETED': return 'completed';
      case 'CANCELLED': return 'cancelled';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'PLANNED': return 'Planifié';
      case 'ONGOING': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELLED': return 'Annulé';
      case 'IN_PROGRESS': return 'En progression';
      case 'POSTPONED': return 'Reporté';
      default: return status;
    }
  }

  private loadMockEvents(): void {
    console.log('📋 Chargement des événements mockés');
    this.events = [
      {
        id: 1,
        title: "Conférence Tech 2024",
        description: "Une grande conférence sur les dernières technologies du moment.",
        startDate: "2024-12-15T09:00:00",
        endDate: "2024-12-15T18:00:00",
        location: "Tunis, Tunisie",
        status: "PLANNED",
        expectedAttendees: 500,
        organizer: "contact@techconf.com"
      },
      {
        id: 2,
        title: "Workshop Spring Boot",
        description: "Apprenez à développer des microservices avec Spring Boot.",
        startDate: "2024-11-20T10:00:00",
        endDate: "2024-11-20T16:00:00",
        location: "Sousse, Tunisie",
        status: "PLANNED",
        expectedAttendees: 100,
        organizer: "training@spring.com"
      },
      {
        id: 3,
        title: "Hackathon Innovation",
        description: "48 heures pour créer des solutions innovantes.",
        startDate: "2024-10-10T08:00:00",
        endDate: "2024-10-12T20:00:00",
        location: "Online",
        status: "ONGOING",
        expectedAttendees: 300,
        organizer: "hackathon@innovation.com"
      },
      {
        id: 4,
        title: "Networking Night",
        description: "Rencontrez des professionnels du secteur IT.",
        startDate: "2024-11-05T18:00:00",
        endDate: "2024-11-05T22:00:00",
        location: "La Marsa, Tunisie",
        status: "PLANNED",
        expectedAttendees: 150,
        organizer: "networking@event.com"
      },
      {
        id: 5,
        title: "AI Summit",
        description: "Le futur de l'intelligence artificielle.",
        startDate: "2025-01-20T09:00:00",
        endDate: "2025-01-20T17:00:00",
        location: "Tunis, Tunisie",
        status: "PLANNED",
        expectedAttendees: 800,
        organizer: "ai@summit.com"
      },
      {
        id: 6,
        title: "DevOps Days",
        description: "Conférence sur les pratiques DevOps.",
        startDate: "2024-10-25T09:00:00",
        endDate: "2024-10-25T18:00:00",
        location: "Sfax, Tunisie",
        status: "PLANNED",
        expectedAttendees: 250,
        organizer: "devops@days.com"
      },
      {
        id: 7,
        title: "Cybersecurity Forum",
        description: "Sécurité informatique et protection des données.",
        startDate: "2024-12-01T09:00:00",
        endDate: "2024-12-01T17:00:00",
        location: "Online",
        status: "PLANNED",
        expectedAttendees: 600,
        organizer: "security@forum.com"
      }
    ];
    this.filteredEvents = this.events;
    console.log(`📋 ${this.events.length} événements mockés chargés`);
  }
}