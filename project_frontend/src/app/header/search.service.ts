import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  search(query: string): Observable<any[]> {
    // Implémentez ici la logique de recherche réelle
    // Pour l'instant, nous retournons un observable vide
    return of([]);
  }
}