import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { Restaurant, Image } from '../models/restaurant.model';

interface EntrepriseDto {
  dateDemande: Date;
  id: number;
  nom: string;
  email: string;
  telephone: string;
  description: string;
  adresse: string;
  typeCuisine: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'NON_ACCEPTEE';
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private apiUrl = 'http://localhost:8081/review';

  constructor(private http: HttpClient) {}

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise`).pipe(
      map(restaurants => restaurants.map(r => this.mapRestaurant(r)))
    );
  }

  getPendingRestaurants(): Observable<Restaurant[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise/statut/EN_ATTENTE`).pipe(
      map(entreprises => entreprises.map(e => this.mapRestaurant(e))),
      catchError(error => {
        console.error('Erreur API:', error);
        return of([]);
      })
    );
  }

  getRestaurantDetails(id: number): Observable<EntrepriseDto> {
    return this.http.get<EntrepriseDto>(`${this.apiUrl}/${id}`);
  }

  updateRestaurantStatus(id: number, statut: string): Observable<any> {
    const url = `${this.apiUrl}/entreprise/${id}/statut`;
    return this.http.patch<any>(url, null, { params: { statut } });
  }

  getListe(id: number, listeName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/entreprises/${id}/${listeName}`).pipe(
      catchError(error => {
        console.error(`Erreur chargement ${listeName}:`, error);
        return of([]);
      })
    );
  }

  getCompleteRestaurant(id: number): Observable<Restaurant> {
    return forkJoin({
      baseData: this.getRestaurantById(id),
      services: this.getListe(id, 'services'),
      options: this.getListe(id, 'optionsAlimentaires'),
      experiences: this.getListe(id, 'experiences'),
      access: this.getListe(id, 'accesibilite')
    }).pipe(
      map(({ baseData, services, options, experiences, access }) => ({
        ...baseData,
        services,
        optionsAlimentaires: options,
        experiences,
        accesibilite: access,
        imagesParCategories: this.mapImages(baseData.images)
      })),
      catchError(err => {
        console.error('Erreur chargement restaurant complet:', err);
        return of(this.getDefaultRestaurant());
      })
    );
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<any>(`${this.apiUrl}/entreprise/${id}`).pipe(
      map(data => this.mapRestaurant(data))
    );
  }

  getProfileImage(entrepriseId: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.apiUrl}/api/images/entreprise/${entrepriseId}/categorie/Profil`).pipe(
      map(images => images || [])
    );
  }

  private mapRestaurant(restaurant: any): Restaurant {
    return {
      id: restaurant.id,
      nomEntreprise: restaurant.nom || restaurant.nomEntreprise,
      matricule: restaurant.matricule || '',
      adresse: restaurant.adresse || '',
      horaires: restaurant.horaires || [],
      telephone: restaurant.telephone || '',
      email: restaurant.email || '',
      description: restaurant.description || '',
      typeCuisine: restaurant.typeCuisine || '',
      gammePrix: restaurant.gammePrix || '',
      statut: restaurant.statut || 'EN_ATTENTE',
      livraisonDisponible: restaurant.livraisonDisponible || false,
      acceptReservation: restaurant.acceptReservation || false,
      rating: restaurant.rating || 0,
      services: restaurant.services || [],
      optionsAlimentaires: restaurant.optionsAlimentaires || [],
      experiences: restaurant.experiences || [],
      accesibilite: restaurant.accesibilite || [],
      images: restaurant.images || [],
      imagesParCategories: this.mapImages(restaurant.images),
      profileImage: restaurant.profileImage || {
        lien: 'assets/images/default-restaurant.jpg',
        alt: restaurant.nom || restaurant.nomEntreprise
      },
      dateDemande: restaurant.dateDemande || undefined
    };
  }

  private mapImages(images: any[]): { categorie: string; images: Image[] }[] {
    if (!images) return [{ categorie: 'Galerie', images: [] }];
    const categories = [...new Set(images.map(img => img.categorie || 'Galerie'))];

    return categories.map(categorie => ({
      categorie,
      images: images
        .filter(img => (img.categorie || 'Galerie') === categorie)
        .map(img => ({
          lien: img.lien,
          alt: img.alt || `Image ${categorie}`
        }))
    }));
  }

  private getDefaultRestaurant(): Restaurant {
    return {
      id: 0,
      nomEntreprise: '',
      matricule: '',
      adresse: '',
      horaires: [],
      telephone: '',
      email: '',
      description: '',
      typeCuisine: '',
      gammePrix: '',
      statut: 'EN_ATTENTE',
      livraisonDisponible: false,
      acceptReservation: false,
      rating: 0,
      services: [],
      optionsAlimentaires: [],
      experiences: [],
      accesibilite: [],
      images: [],
      imagesParCategories: [{
        categorie: 'Galerie',
        images: []
      }],
      profileImage: {
        lien: 'assets/images/default-restaurant.jpg'
      },
      dateDemande: undefined
    };
  }
}
