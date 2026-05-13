// src/app/front-office/events/event-detail/event-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, finalize } from 'rxjs';
import { EventService } from '../../service/event.service';
import { RecommendationService } from '../../service/recommendation.service';
import { SentimentService } from '../../service/sentiment.service';
import { CommentWithSentiment, EventSentimentStats } from '../../models/sentiment.model';
import { AppEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: AppEvent | null = null;
  stats: EventSentimentStats | null = null;
  comments: CommentWithSentiment[] = [];
  commentForm: FormGroup;
  loading = false;
  currentUserId = 1;
  hasUserCommented = false;
  predictionScore: number | null = null;
  willLike: boolean | null = null;
  currentPage = 0;
  totalPages = 1;
  totalComments = 0;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private eventService: EventService,
    private recommendationService: RecommendationService,
    private sentimentService: SentimentService
  ) {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (eventId) {
      this.loadEvent(eventId);
      this.loadStats(eventId);
      this.loadComments(eventId);
      this.checkIfUserCommented(eventId);
      this.loadPrediction(eventId);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadEvent(id: number): void {
    this.subscriptions.add(
      this.eventService.getEventById(id).subscribe({
        next: (event) => {
          this.event = event;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.loadMockEvent(id);
        }
      })
    );
  }

  loadStats(id: number): void {
    this.subscriptions.add(
      this.sentimentService.getEventStats(id).subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: (error) => {
          console.error('Error loading stats:', error);
        }
      })
    );
  }

  loadComments(id: number, page: number = 0): void {
    this.subscriptions.add(
      this.sentimentService.getEventComments(id, page, 10).subscribe({
        next: (response) => {
          this.comments = response.content || response.comments || response;
          this.totalComments = response.totalElements || response.totalComments || this.comments.length;
          this.totalPages = response.totalPages || 1;
          this.currentPage = page;
        },
        error: (error) => {
          console.error('Error loading comments:', error);
        }
      })
    );
  }

  checkIfUserCommented(eventId: number): void {
    // Check from localStorage if user has already commented
    const commented = localStorage.getItem(`commented_${eventId}_${this.currentUserId}`);
    this.hasUserCommented = commented === 'true';
    
    if (this.hasUserCommented) {
      this.commentForm.disable();
    }
  }

  loadPrediction(eventId: number): void {
    this.subscriptions.add(
      this.recommendationService.getPredictions(this.currentUserId, eventId, 'VIEW', 'Conference')
        .subscribe({
          next: (prediction) => {
            this.predictionScore = prediction.score * 100;
            this.willLike = prediction.will_like;
          },
          error: (error) => {
            console.error('Error loading prediction:', error);
            this.predictionScore = 65;
            this.willLike = true;
          }
        })
    );
  }

  onSubmitComment(): void {
    if (this.commentForm.invalid || this.hasUserCommented || !this.event) return;

    this.loading = true;
    const commentText = this.commentForm.get('comment')?.value;
    
    this.subscriptions.add(
      this.sentimentService.addCommentWithSentiment(commentText, this.event.id, this.currentUserId)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (comment) => {
            this.comments.unshift(comment);
            this.hasUserCommented = true;
            this.commentForm.disable();
            
            // Save to localStorage
            localStorage.setItem(`commented_${this.event!.id}_${this.currentUserId}`, 'true');
            
            // Update stats locally
            if (this.stats) {
              this.stats.totalComments++;
              if (comment.sentiment === 'POSITIVE') {
                this.stats.positiveCount++;
                this.stats.positivePercentage = (this.stats.positiveCount / this.stats.totalComments) * 100;
              } else if (comment.sentiment === 'NEGATIVE') {
                this.stats.negativeCount++;
                this.stats.negativePercentage = (this.stats.negativeCount / this.stats.totalComments) * 100;
              } else {
                this.stats.neutralCount++;
                this.stats.neutralPercentage = (this.stats.neutralCount / this.stats.totalComments) * 100;
              }
              
              const posWeight = this.stats.positiveCount * 1;
              const neuWeight = this.stats.neutralCount * 0.5;
              this.stats.overallSentimentScore = (posWeight + neuWeight) / this.stats.totalComments;
            }
            
            this.totalComments = this.comments.length;
          },
          error: (error) => {
            console.error('Error submitting comment:', error);
            alert('Error submitting comment. Please try again.');
          }
        })
    );
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages && this.event) {
      this.loadComments(this.event.id, page);
    }
  }

  getSentimentClass(sentiment: string): string {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE': return 'sentiment-positive';
      case 'NEUTRAL': return 'sentiment-neutral';
      case 'NEGATIVE': return 'sentiment-negative';
      default: return '';
    }
  }

  getSentimentIcon(sentiment: string): string {
    switch (sentiment?.toUpperCase()) {
      case 'POSITIVE': return '😊';
      case 'NEUTRAL': return '😐';
      case 'NEGATIVE': return '😞';
      default: return '💬';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PLANNED': 'Planned',
      'ONGOING': 'In Progress',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled',
      'IN_PROGRESS': 'In Progress',
      'POSTPONED': 'Postponed'
    };
    return statusMap[status] || status || 'Unknown';
  }

  private loadMockEvent(id: number): void {
    this.event = {
      id: id,
      title: "Tech Conference 2024",
      description: "A major conference on the latest technologies. Featuring: Artificial Intelligence, Blockchain, Cloud Computing, DevOps, and more.",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
      location: "Tunis, Tunisia",
      status: "PLANNED",
      expectedAttendees: 500,
      organizer: "contact@techconf.com"
    };
  }
}