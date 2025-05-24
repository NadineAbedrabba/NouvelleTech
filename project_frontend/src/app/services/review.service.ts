import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = 'http://localhost:8081/review/api/reviews';
  
  constructor(private http: HttpClient) {
    console.log('ReviewService initialisé avec URL:', this.baseUrl);
  }

  /**
   * Crée une nouvelle review
   * @param review Les données de la review à créer
   * @returns La review créée avec son ID
   */
  createReview(review: ReviewDTO): Observable<ReviewDTO> {
    console.log(`Envoi d'une requête POST à ${this.baseUrl}`);
    console.log('Données envoyées:', JSON.stringify(review, null, 2));
    
    // Vérifier que les données sont valides
    if (!review.entrepriseId) {
      console.warn('Attention: entrepriseId est null ou non défini');
    }
    if (!review.clientId) {
      console.warn('Attention: clientId est null ou non défini');
    }
    
    return this.http.post<ReviewDTO>(this.baseUrl, review);
  }

  /**
   * Récupère toutes les reviews d'une entreprise
   * @param entrepriseId L'ID de l'entreprise
   * @returns La liste des reviews de l'entreprise
   */
  getReviewsByEntreprise(entrepriseId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/entreprise/${entrepriseId}`);
  }

  /**
   * Récupère toutes les reviews d'un client
   * @param clientId L'ID du client
   * @returns La liste des reviews du client
   */
  getReviewsByClient(clientId: number): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/client/${clientId}`);
  }

  /**
   * Supprime une review
   * @param reviewId L'ID de la review à supprimer
   */
  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`);
  }
}
