import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HoraireJournalier {
  ouvert: boolean;
  heureOuverture?: string;
  heureFermeture?: string;
}

export interface ImageDto {
  id?: number;
  lien: string;
  categorie?: string;
}

export interface EntrepriseDTO {
  id: number;
  matricule?: string;
  nomEntreprise: string;
  email?: string;
  adresse?: string;
  telephone?: string;
  typeCuisine?: string;
  description?: string;
  statut?: string;
  complet?: boolean;
  acceptReservation?: boolean;
  livraisonDisponible?: boolean;
  gammePrix?: string;
  horaires?: Record<string, HoraireJournalier>;
  services?: string[];
  optionsAlimentaires?: string[];
  experiences?: string[];
  caracteristiqueRepas?: string[];
  accesibilite?: string[];
  dateDemande?: string;
  images?: ImageDto[];
  rating?: number; // Ajouté pour notre frontend
}

@Injectable({
  providedIn: 'root'
})
export class EntrepriseService {
  private baseUrl = 'http://localhost:8081/review/entreprise';

  constructor(private http: HttpClient) { }

  /**
   * Récupère toutes les entreprises
   * @returns La liste des entreprises
   */
  getAllEntreprises(): Observable<EntrepriseDTO[]> {
    console.log('Appel API vers:', this.baseUrl);
    return this.http.get<EntrepriseDTO[]>(this.baseUrl);
  }

  /**
   * Récupère une entreprise par son ID
   * @param id L'ID de l'entreprise
   * @returns L'entreprise correspondant à l'ID
   */
  getEntrepriseById(id: number): Observable<EntrepriseDTO> {
    return this.http.get<EntrepriseDTO>(`${this.baseUrl}/${id}`);
  }
  
  /**
   * Récupère les entreprises par type de cuisine
   * @param type Le type de cuisine
   * @returns La liste des entreprises correspondant au type de cuisine
   */
  getEntreprisesByTypeCuisine(type: string): Observable<EntrepriseDTO[]> {
    return this.http.get<EntrepriseDTO[]>(`${this.baseUrl}/type-cuisine/${type}`);
  }
  
  /**
   * Recherche des entreprises par nom
   * @param nom Le nom à rechercher
   * @returns La liste des entreprises correspondant au nom recherché
   */
  searchEntreprisesByNom(nom: string): Observable<EntrepriseDTO[]> {
    return this.http.get<EntrepriseDTO[]>(`${this.baseUrl}/search?nom=${nom}`);
  }
}
