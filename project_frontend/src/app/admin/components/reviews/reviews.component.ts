import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedReviewId: number | null = null;

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
      // Implémentez ici la logique de suppression
      console.log('Avis supprimé:', this.selectedReviewId);
      this.contextMenuVisible = false;
    }
  }

  viewDetails() {
    if (this.selectedReviewId) {
      // Implémentez ici la navigation vers les détails
      console.log('Voir détails de l\'avis:', this.selectedReviewId);
      this.contextMenuVisible = false;
    }
  }
}