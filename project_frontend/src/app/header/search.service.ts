import { Injectable } from '@angular/core';
import { Observable, of, catchError, map } from 'rxjs';
import { EntrepriseService, EntrepriseDTO } from '../services/entreprise.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private entrepriseService: EntrepriseService) {}
  
  /**
   * Recherche des restaurants par nom
   * @param query La requête de recherche
   * @returns Une liste d'entreprises correspondant à la recherche
   */
  search(query: string): Observable<EntrepriseDTO[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }
    
    return this.entrepriseService.searchEntreprisesByNom(query).pipe(
      catchError(error => {
        console.error('Erreur lors de la recherche d\'entreprises:', error);
        return of([]);
      })
    );
  }
}