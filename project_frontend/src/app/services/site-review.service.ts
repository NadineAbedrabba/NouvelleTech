import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SiteReviewDTO {
  id?: number;
  rating: number;
  commentaire: string;
  createdAt?: Date;
  clientId?: number;
  clientName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteReviewService {
  private baseUrl = `${environment.apiBaseUrl}/review/api/site-reviews`;

  constructor(private http: HttpClient) { }

  // Créer un nouvel avis sur le site
  createSiteReview(review: SiteReviewDTO): Observable<SiteReviewDTO> {
    console.log('Envoi d\'un avis sur le site:', review);
    console.log('URL utilisée:', this.baseUrl);
    
    return this.http.post<SiteReviewDTO>(this.baseUrl, review)
      .pipe(
        tap(
          (response: SiteReviewDTO) => console.log('Réponse du serveur:', response),
          (error: HttpErrorResponse) => {
            console.error('Erreur détaillée:', error);
            if (error.status === 0) {
              console.error('Erreur de connexion: Vérifiez que le serveur backend est en cours d\'exécution et accessible à', this.baseUrl);
            } else if (error.status === 404) {
              console.error('URL introuvable: Vérifiez que l\'URL', this.baseUrl, 'est correcte et que le contrôleur backend gère cette route');
            } else if (error.status === 500) {
              console.error('Erreur serveur: Vérifiez les logs du serveur pour plus de détails');
            }
          }
        )
      );
  }

  // Récupérer tous les avis sur le site
  getAllSiteReviews(): Observable<SiteReviewDTO[]> {
    return this.http.get<SiteReviewDTO[]>(this.baseUrl);
  }

  // Récupérer les avis récents sur le site
  getRecentSiteReviews(): Observable<SiteReviewDTO[]> {
    return this.http.get<SiteReviewDTO[]>(`${this.baseUrl}/recent`);
  }

  // Récupérer les avis les mieux notés sur le site
  getTopRatedSiteReviews(): Observable<SiteReviewDTO[]> {
    return this.http.get<SiteReviewDTO[]>(`${this.baseUrl}/top-rated`);
  }

  // Récupérer les avis d'un client spécifique
  getSiteReviewsByClient(clientId: number): Observable<SiteReviewDTO[]> {
    return this.http.get<SiteReviewDTO[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // Supprimer un avis
  deleteSiteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  // Récupérer la moyenne des avis et le nombre total d'avis
  getSiteReviewStats(): Observable<{averageRating: number, totalReviews: number}> {
    return this.http.get<{averageRating: number, totalReviews: number}>(`${this.baseUrl}/stats`);
  }
  
  // Calculer la moyenne des avis localement si l'endpoint stats n'existe pas
  calculateAverageRating(reviews: SiteReviewDTO[]): {averageRating: number, totalReviews: number} {
    if (!reviews || reviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length
    };
  }
}
