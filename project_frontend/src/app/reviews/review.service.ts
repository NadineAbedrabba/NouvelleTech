import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { EntrepriseService, EntrepriseDTO } from '../services/entreprise.service';
import { environment } from '../../environments/environment';

export interface ReviewDTO {
  id: number;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  commentaire: string;
  companion: string;
  occasion: string;
  certified: boolean;
  clientId: number;
  entrepriseId: number;
  createdAt?: Date; // Ajouté pour afficher la date de création
  entrepriseName?: string; // Ajouté pour afficher le nom de l'entreprise
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  constructor(
    private http: HttpClient,
    private entrepriseService: EntrepriseService
  ) { }

  // Récupérer les avis d'un client par son ID
  getReviewsByClientId(clientId: number): Observable<ReviewDTO[]> {
    const token = localStorage.getItem('authToken');
    
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get<ReviewDTO[]>(`${environment.apiBaseUrl}/review/api/reviews/client/${clientId}`, httpOptions);
  }

  // Récupérer les avis du client connecté
  getMyReviews(): Observable<ReviewDTO[]> {
    console.log('Début de getMyReviews');
    const clientId = localStorage.getItem('clientId');
    console.log('Client ID from localStorage:', clientId);
    
    if (!clientId) {
      console.error('Erreur: Aucun client ID trouvé dans le localStorage');
      return throwError(() => new Error('Client ID not found in localStorage'));
    }
    
    // Convertir l'ID client en nombre et vérifier qu'il est valide
    const clientIdNumber = Number(clientId);
    if (isNaN(clientIdNumber) || clientIdNumber <= 0) {
      console.error('Erreur: ID client invalide:', clientId);
      return throwError(() => new Error('Invalid client ID'));
    }
    
    console.log('Appel de getReviewsByClientId avec clientId:', clientIdNumber);
    return this.getReviewsByClientId(clientIdNumber).pipe(
      switchMap(reviews => {
        console.log('Avis bruts reçus:', reviews);
        if (reviews.length === 0) {
          console.log('Aucun avis trouvé pour le client ID:', clientIdNumber);
        }
        return this.enrichReviewsWithEntrepriseInfo(reviews);
      }),
      catchError(error => {
        console.error('Erreur dans getMyReviews:', error);
        return throwError(() => error);
      })
    );
  }
  
  // Enrichir les avis avec les informations des entreprises
  private enrichReviewsWithEntrepriseInfo(reviews: ReviewDTO[]): Observable<ReviewDTO[]> {
    if (!reviews || reviews.length === 0) {
      return of([]);
    }
    
    console.log('Enrichissement des avis avec les informations des entreprises');
    console.log('Avis avant enrichissement:', JSON.stringify(reviews, null, 2));
    
    // Vérifier et convertir les dates si nécessaire
    reviews.forEach((review, index) => {
      console.log(`Vérification de la date pour l'avis #${index + 1} - ID: ${review.id}`);
      if (review.createdAt) {
        console.log(`Date avant conversion: ${review.createdAt}, Type: ${typeof review.createdAt}`);
        // Si la date est une chaîne, la convertir en objet Date
        if (typeof review.createdAt === 'string') {
          review.createdAt = new Date(review.createdAt);
          console.log(`Date après conversion: ${review.createdAt}`);
        }
      } else {
        console.warn(`Pas de date de création pour l'avis #${index + 1} - ID: ${review.id}`);
      }
    });
    
    // Créer un tableau d'observables pour chaque entreprise
    const entrepriseObservables = reviews.map(review => 
      this.entrepriseService.getEntrepriseById(review.entrepriseId).pipe(
        map(entreprise => ({
          review,
          entreprise
        })),
        catchError((error) => {
          console.error(`Erreur lors de la récupération de l'entreprise ID ${review.entrepriseId}:`, error);
          return of({ review, entreprise: null });
        })
      )
    );
    
    // Combiner tous les observables
    return forkJoin(entrepriseObservables).pipe(
      map(results => {
        // Mettre à jour chaque avis avec le nom de l'entreprise
        const enrichedReviews = results.map(result => {
          const enrichedReview = { ...result.review };
          if (result.entreprise) {
            enrichedReview.entrepriseName = result.entreprise.nomEntreprise;
            console.log(`Avis ID ${enrichedReview.id} enrichi avec le nom d'entreprise: ${enrichedReview.entrepriseName}`);
          } else {
            console.warn(`Pas d'information d'entreprise pour l'avis ID ${enrichedReview.id}`);
          }
          return enrichedReview;
        });
        
        console.log('Avis après enrichissement:', JSON.stringify(enrichedReviews, null, 2));
        return enrichedReviews;
      })
    );
  }

  // Supprimer un avis
  deleteReview(reviewId: number): Observable<void> {
    const token = localStorage.getItem('authToken');
    
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.delete<void>(`${environment.apiBaseUrl}/review/api/reviews/${reviewId}`, httpOptions);
  }
}
