import { Component, HostListener, OnInit } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { Review } from '../../../models/review.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; // Added for change detection

@Component({
  selector: 'app-admin-reviews', // Updated selector to reflect purpose
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminReviewsComponent implements OnInit {
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedReviewId: number | null = null;
  reviews: Review[] = [];
  entrepriseId!: number;
  errorMessage: string | undefined;

  constructor(
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef // Added for change detection
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.entrepriseId = +id;
        this.loadReviews();
      } else {
        this.errorMessage = 'Aucun ID d’entreprise trouvé dans l’URL.';
        console.warn(this.errorMessage);
        this.cdRef.detectChanges();
      }
    });
  }

  loadReviews() {
    this.reviewService.getReviewsByEntreprise(this.entrepriseId).subscribe({
      next: (data) => {
        console.log('Received reviews data:', data);
        this.reviews = data;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des avis:', err);
        this.errorMessage = 'Échec du chargement des avis.';
        this.cdRef.detectChanges();
      }
    });
  }

  showContextMenu(event: MouseEvent, reviewId: number) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.selectedReviewId = reviewId;
    this.contextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  deleteReview() {
    if (this.selectedReviewId && confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.reviewService.deleteReview(this.selectedReviewId).subscribe({
        next: () => {
          this.loadReviews();
          this.contextMenuVisible = false;
          alert('Avis supprimé !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression de l’avis:', err);
          this.errorMessage = 'Échec de la suppression de l’avis.';
          this.cdRef.detectChanges();
        }
      });
    }
  }

  viewDetails() {
    if (this.selectedReviewId) {
      console.log('Voir détails de l’avis:', this.selectedReviewId);
      this.contextMenuVisible = false;
    }
  }

  getRandomColor(): string {
    const colors = ['#4A81A8', '#991e2a', '#4CAF50', '#9C27B0', '#FF9800'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getRandomAvatar(): string {
    const avatars = [
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(3).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(5).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(6).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(7).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(8).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(9).webp',
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(10).webp'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  getStars(rating: number): number[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(1);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(0.5);
      } else {
        stars.push(0);
      }
    }
    return stars;
  }

  getClientPhoto(photoUrl: string | null | undefined): string {
    console.log('Processing client photo URL:', photoUrl);

    if (!photoUrl) {
      console.log('No photo URL provided, returning default image: assets/profilClient.jpg');
      return 'profilClient.jpg';
    }

    // Handle local assets (no backend prefix or timestamp)
    if (photoUrl.startsWith('/assets/') || photoUrl.startsWith('assets/')) {
      console.log('Local asset detected:', photoUrl);
      return photoUrl.replace(/^\/+/, ''); // Remove leading slashes
    }

    // Handle external URLs
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      console.log('External URL detected:', photoUrl);
      return photoUrl; // No timestamp to avoid change detection issues
    }

    // Handle backend-hosted images
    const cleanPath = photoUrl.replace(/^\/+/, '');
    const fullUrl = `http://localhost:8081/review/${cleanPath}?t=${Date.now()}`;
    console.log('Constructed backend image URL:', fullUrl);
    return fullUrl;
  }

  handleImageError(event: Event, photoUrl?: string): void {
    const imgElement = event.target as HTMLImageElement;
    console.error(`Failed to load image: ${photoUrl || 'unknown URL'}`);
    if (imgElement.src !== 'assets/profilClient.jpg') {
      console.log('Setting default image for:', photoUrl);
      imgElement.src = 'assets/profilClient.jpg';
      imgElement.onerror = null; // Prevent infinite error loop
    }
    this.cdRef.detectChanges();
  }
}