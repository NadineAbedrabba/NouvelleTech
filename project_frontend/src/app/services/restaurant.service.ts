import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, of, throwError } from 'rxjs';
import { Restaurant, Image, HoraireJournalier } from '../models/restaurant.model';

export interface EntrepriseDto {
  profileImage: any;
  gammePrix: any;
  horaires: HoraireJournalier[];
  horaireDeTravail: any;
  localisation: any;
  livraisonDisponible: any;
  acceptReservation: any;
  photoProfil: any;
  rating:any;
  accesibilite: any;
  caracteristiqueRepas: any;
  experiences: any[];
  optionsAlimentaires: any;
  services: any;
  complet: boolean;
  imagesParCategories: any[];
  dateDemande: Date;
  id: number;
  nomEntreprise: string;
  matricule: string;
  email: string;
  telephone: string;
  description: string;
  adresse: string;
  typeCuisine: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'NON_ACCEPTEE';
  images: Image[];
}

export interface DashboardStats {
  totalEntreprises: number;
  entreprisesApprouvees: number;
  entreprisesEnAttente: number;
  entreprisesRejetees: number;
  totalClients: number;
  totalReservations: number;
  reservationsParMois: { mois: string; count: number }[];
  typesCuisine: { type: string; count: number }[];
  topEntreprises: { id: number; nom: string; rating: number }[];
  activitesRecent: any[];
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  
  private apiUrl = 'http://localhost:8081/review';
  private imageApiUrl = 'http://localhost:8081/review/api/images';

  constructor(private http: HttpClient) {}

  // Méthodes pour le dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      stats: this.http.get<any>(`${this.apiUrl}/dashboard/stats`),
      reservations: this.http.get<any[]>(`${this.apiUrl}/dashboard/reservations`),
      cuisineTypes: this.http.get<any[]>(`${this.apiUrl}/dashboard/cuisine-types`),
      topEntreprises: this.http.get<any[]>(`${this.apiUrl}/dashboard/top-entreprises`),
      activities: this.http.get<any[]>(`${this.apiUrl}/dashboard/activities`)
    }).pipe(
      map(({ stats, reservations, cuisineTypes, topEntreprises, activities }) => ({
        totalEntreprises: stats.totalEntreprises,
        entreprisesApprouvees: stats.entreprisesApprouvees,
        entreprisesEnAttente: stats.entreprisesEnAttente,
        entreprisesRejetees: stats.entreprisesRejetees,
        totalClients: stats.totalClients,
        totalReservations: stats.totalReservations,
        reservationsParMois: reservations,
        typesCuisine: cuisineTypes,
        topEntreprises: topEntreprises,
        activitesRecent: activities
      })),
      catchError(error => {
        console.error('Erreur lors du chargement des statistiques:', error);
        return of(this.getDefaultStats());
      })
    );
  }


  deleteRestaurant(id: number) {
    return this.http.delete(`${this.apiUrl}/entreprise/${id}`);
  }
  


  private getDefaultStats(): DashboardStats {
    return {
      totalEntreprises: 0,
      entreprisesApprouvees: 0,
      entreprisesEnAttente: 0,
      entreprisesRejetees: 0,
      totalClients: 0,
      totalReservations: 0,
      reservationsParMois: [],
      typesCuisine: [],
      topEntreprises: [],
      activitesRecent: []
    };
  }

  // Méthodes existantes (conservées mais simplifiées)
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entreprise`).pipe(
      map(restaurants => restaurants.map(r => this.mapRestaurant(r))),
      catchError(error => {
        console.error('Erreur API:', error);
        return of([]);
      })
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
    return this.http.get<EntrepriseDto>(`${this.apiUrl}/entreprise/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateRestaurantStatus(id: number, statut: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/entreprise/${id}/statut`, null, { params: { statut } }).pipe(
      catchError(this.handleError)
    );
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
      acceptReservation: restaurant.acceptReservation || true,
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
      acceptReservation: true,
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










  
  // Fetch restaurant by ID
  getEntreprise(id: number): Observable<EntrepriseDto> {
    return this.http.get<EntrepriseDto>(`${this.apiUrl}/entreprise/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Update restaurant details
 // restaurant.service.ts
updateEntreprise(id: number, entreprise: any): Observable<any> {
  const url = `http://localhost:8081/review/entreprise/${id}`;
  
  return this.http.put(url, entreprise).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        // Erreur de connexion
        console.error('Erreur de connexion au serveur');
        return throwError(() => new Error('Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.'));
      } else {
        // Autres erreurs
        console.error(`Erreur serveur: ${error.status}`, error.error);
        return throwError(() => new Error(error.error?.message || 'Erreur serveur'));
      }
    })
  );
}

  // Update restaurant status (complet)
  updateStatus(id: number, complet: boolean): Observable<EntrepriseDto> {
    const entreprise = { complet };
    return this.http.put<EntrepriseDto>(`${this.apiUrl}/entreprise/${id}`, entreprise).pipe(
      catchError(this.handleError)
    );
  }

  // Add item to a list (services, options, etc.)
  addToList(entrepriseId: number, listName: string, value: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/entreprises/${entrepriseId}/${listName}`, value, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }
  removeFromList(entrepriseId: number, listName: string, value: string): Observable<any> {
    const url = `${this.apiUrl}/api/entreprises/${entrepriseId}/${listName}/${value}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  

  // Get images by entreprise and category
  getImagesByEntrepriseAndCategory(entrepriseId: number, category: string): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.imageApiUrl}/entreprise/${entrepriseId}/categorie/${category}`).pipe(
      catchError(this.handleError)
    );
  }

  // Upload image
  uploadImage(entrepriseId: number, category: string, file: File): Observable<Image> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('categorie', category);
    formData.append('entrepriseId', entrepriseId.toString());
    
    return this.http.post<Image>(this.imageApiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Dans restaurant.service.ts
deleteImage(imageId: number): Observable<void> {
  return this.http.delete<void>(`${this.imageApiUrl}/${imageId}`).pipe(
    catchError(this.handleError)
  );
}
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
    if (error.status === 0) {
      errorMessage = 'Impossible de se connecter au serveur. Vérifiez si le serveur est en cours d\'exécution ou votre connexion réseau.';
    } else if (error.status === 403) {
      errorMessage = 'Accès interdit. Vérifiez vos permissions ou reconnectez-vous.';
    } else {
      errorMessage = error.error?.message || `Erreur serveur: ${error.status}`;
    }
    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }



  // Dans RestaurantService
// Update status (complet)
updateCompletStatus(id: number, complet: boolean): Observable<EntrepriseDto> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // Add authentication header if required
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  });
  return this.http.patch<EntrepriseDto>(`${this.apiUrl}/entreprise/${id}/complet`, { complet }, { headers }).pipe(
    catchError(this.handleError)
  );
}




}
export { Image };