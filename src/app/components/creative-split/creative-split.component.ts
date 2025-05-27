import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteReviewService } from '../../services/site-review.service';

@Component({
  selector: 'app-creative-split',
  templateUrl: './creative-split.component.html',
  styleUrls: ['./creative-split.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CreativeSplitComponent implements OnInit {
  // Note moyenne globale du site
  averageRating: number = 0;
  totalReviews: number = 0;
  
  constructor(private siteReviewService: SiteReviewService) {}
  
  ngOnInit(): void {
    this.loadSiteRating();
  }
  
  /**
   * Charge la note moyenne globale du site
   */
  loadSiteRating(): void {
    this.siteReviewService.getSiteReviewStats().subscribe({
      next: (stats) => {
        console.log('Statistiques des avis du site:', stats);
        this.averageRating = stats.averageRating;
        this.totalReviews = stats.totalReviews;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des statistiques des avis du site:', error);
        // En cas d'erreur, utiliser une valeur par défaut ou essayer de calculer localement
        this.loadSiteReviewsAndCalculateAverage();
      }
    });
  }
  
  /**
   * Méthode de secours pour calculer la moyenne localement si l'API stats échoue
   */
  private loadSiteReviewsAndCalculateAverage(): void {
    this.siteReviewService.getAllSiteReviews().subscribe({
      next: (reviews) => {
        const stats = this.siteReviewService.calculateAverageRating(reviews);
        this.averageRating = stats.averageRating;
        this.totalReviews = stats.totalReviews;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des avis du site:', error);
        // En cas d'échec total, utiliser une valeur par défaut
        this.averageRating = 4.8;
        this.totalReviews = 0;
      }
    });
  }
}
