import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Review } from '../models/review.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = 'http://localhost:8081/review/api/reviews';
  private clientApiUrl = 'http://localhost:8081/review/client';

  constructor(private http: HttpClient) {}

  // ✅ Récupère les avis d'une entreprise avec infos client enrichies
  getReviewsByEntreprise(entrepriseId: number): Observable<(Review & { clientName: string, clientPhoto: string })[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/entreprise/${entrepriseId}`).pipe(
      switchMap(reviews => {
        const enrichedReviews$ = reviews.map(review =>
          this.http.get<Client>(`${this.clientApiUrl}/${review.clientId}`).pipe(
            map(client => ({
              ...review,
              clientName: client.nom, 
              clientPhoto: client.photoUrl || 'assets/images/default-avatar.png'
            }))
          )
        );
        return forkJoin(enrichedReviews$);
      })
    );
  }

  // ✅ Supprime un avis par ID
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
