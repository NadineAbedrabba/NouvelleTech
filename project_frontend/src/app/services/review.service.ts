import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReviewDTO } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private baseUrl = `${environment.apiBaseUrl}/review/api/reviews`;
  // Note: L'URL utilise le contexte de servlet /review configuré dans application.properties
  
  constructor(private http: HttpClient) {
    console.log('ReviewService initialisé avec URL:', this.baseUrl);
  }
  
  /**
   * Crée les en-têtes HTTP avec le token JWT
   * @returns Les options HTTP avec les en-têtes
   */
  private getHttpOptions() {
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer les en-têtes HTTP avec le token JWT
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      })
    };
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
      
      // Vérifier si l'ID client est disponible dans le localStorage
      const clientIdFromStorage = localStorage.getItem('clientId');
      if (clientIdFromStorage) {
        console.log(`ID client trouvé dans localStorage: ${clientIdFromStorage}. Mise à jour de la review.`);
        review.clientId = Number(clientIdFromStorage);
      } else {
        console.error('Aucun ID client trouvé dans localStorage. La requête risque d\'échouer.');
      }
    }
    
    // Afficher les informations de débogage
    console.log('ID client final utilisé pour la review:', review.clientId);
    console.log('ID entreprise final utilisé pour la review:', review.entrepriseId);
    
    // Utiliser la méthode utilitaire pour obtenir les en-têtes HTTP
    const httpOptions = this.getHttpOptions();
    console.log('Token JWT utilisé pour la requête:', localStorage.getItem('authToken') ? 'Présent' : 'Absent');
    
    // Envoyer la requête avec les en-têtes
    return this.http.post<ReviewDTO>(this.baseUrl, review, httpOptions);
  }

  /**
   * Récupère toutes les reviews d'une entreprise
   * @param entrepriseId L'ID de l'entreprise
   * @returns La liste des reviews de l'entreprise
   */
  getReviewsByEntreprise(entrepriseId: number): Observable<ReviewDTO[]> {
    // Utiliser la méthode utilitaire pour obtenir les en-têtes HTTP
    const httpOptions = this.getHttpOptions();
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/entreprise/${entrepriseId}`, httpOptions);
  }

  /**
   * Récupère toutes les reviews d'un client
   * @param clientId L'ID du client
   * @returns La liste des reviews du client
   */
  getReviewsByClient(clientId: number): Observable<ReviewDTO[]> {
    // Utiliser la méthode utilitaire pour obtenir les en-têtes HTTP
    const httpOptions = this.getHttpOptions();
    return this.http.get<ReviewDTO[]>(`${this.baseUrl}/client/${clientId}`, httpOptions);
  }

  /**
   * Supprime une review
   * @param reviewId L'ID de la review à supprimer
   */
  deleteReview(reviewId: number): Observable<void> {
    // Utiliser la méthode utilitaire pour obtenir les en-têtes HTTP
    const httpOptions = this.getHttpOptions();
    return this.http.delete<void>(`${this.baseUrl}/${reviewId}`, httpOptions);
  }
}
