import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface Image {
  id: number;
  url: string;
  name?: string;
}

export interface Client {
  id: number;
  userId: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
  image?: Image;
  imageUrl?: string; // Gardé pour compatibilité avec le code existant
  photoUrl?: string; // URL de l'image de profil
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiBaseUrl;
  
  // BehaviorSubject pour stocker l'utilisateur connecté
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  
  // BehaviorSubject pour stocker les informations du client
  private currentClientSubject = new BehaviorSubject<Client | null>(null);
  currentClient$ = this.currentClientSubject.asObservable();

  constructor(private http: HttpClient) {
    // Vérifier si un utilisateur est déjà stocké dans le localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.loadClientInfo(JSON.parse(storedUser).id);
    }
  }

  // Méthode pour définir l'utilisateur connecté
  setCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Charger les informations du client associé
    this.loadClientInfo(user.id);
  }

  // Méthode pour récupérer l'utilisateur connecté
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Méthode pour vérifier si un utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  // Méthode pour forcer la notification de changement d'état de connexion
  notifyLoginStateChange(): void {
    // Réémettre la valeur actuelle pour forcer les composants abonnés à se mettre à jour
    const currentUser = this.currentUserSubject.value;
    this.currentUserSubject.next(null);
    setTimeout(() => {
      this.currentUserSubject.next(currentUser);
    }, 10);
  }

  // Méthode pour déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.currentClientSubject.next(null);
  }

  // Méthode pour charger les informations du client associé à l'utilisateur
  loadClientInfo(userId: number): void {
    console.log(`Tentative de récupération des informations client pour l'utilisateur ID: ${userId}`);
    
    // Si l'ID utilisateur est 0 ou invalide, créer un client par défaut
    if (!userId || userId === 0) {
      console.warn('ID utilisateur invalide (0 ou null). Création d\'un client par défaut.');
      this.createDefaultClient(userId || 1);
      return;
    }
    
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer un objet HttpHeaders pour les en-têtes
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    // Ajouter le token JWT à la requête
    this.http.get<any>(`${this.apiUrl}/review/client/by-user/${userId}`, httpOptions).subscribe({
      next: (response) => {
        console.log('Réponse complète de loadClientInfo:', response);
        
        // Extraire les informations client de la réponse
        let clientInfo = response;
        
        // Si la réponse est un objet avec une propriété 'data' ou 'client'
        if (response && typeof response === 'object') {
          if (response.data) clientInfo = response.data;
          else if (response.client) clientInfo = response.client;
          else if (response.content) clientInfo = response.content;
        }
        
        // Vérifier que les informations client sont valides
        if (clientInfo && (clientInfo.id || clientInfo.nom || clientInfo.prenom)) {
          const client: Client = {
            id: clientInfo.id || 0,
            userId: userId,
            nom: clientInfo.nom || '',
            prenom: clientInfo.prenom || '',
            email: clientInfo.email || '',
            telephone: clientInfo.telephone || '',
            adresse: clientInfo.adresse || '',
            ville: clientInfo.ville || '',
            codePostal: clientInfo.codePostal || '',
            pays: clientInfo.pays || 'Tunisie',
            image: clientInfo.image,
            imageUrl: clientInfo.image?.url || clientInfo.imageUrl
          };
          
          // Mettre à jour le BehaviorSubject avec les nouvelles informations
          this.currentClientSubject.next(client);
          
          // Stocker l'ID client dans localStorage pour les futures utilisations
          if (client.id) {
            localStorage.setItem('clientId', client.id.toString());
          }
        } else {
          // Si aucune information client valide n'est trouvée, créer un client par défaut
          this.createDefaultClient(userId);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des informations client:', error);
        // En cas d'erreur, créer un client par défaut
        this.createDefaultClient(userId);
      }
    });
  }

  // Méthode pour créer un client par défaut en cas d'erreur ou d'absence de données
  createDefaultClient(userId: number): void {
    console.log('Création d\'un client par défaut pour l\'utilisateur ID:', userId);
    
    const defaultClient: Client = {
      id: 0, // ID 0 indique un nouveau client
      userId: userId,
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: 'Tunisie',
      image: undefined
    };
    
    this.currentClientSubject.next(defaultClient);
  }

  // Méthode pour récupérer les informations du client par ID utilisateur
  getClientByUserId(userId: number): Observable<Client> {
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer un objet HttpHeaders pour les en-têtes
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    return this.http.get<any>(`${this.apiUrl}/review/client/by-user/${userId}`, httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Réponse complète de getClientByUserId:', response);
          
          // Extraire les informations client de la réponse
          let clientInfo = response;
          
          // Si la réponse est un objet avec une propriété 'data' ou 'client'
          if (response && typeof response === 'object') {
            if (response.data) clientInfo = response.data;
            else if (response.client) clientInfo = response.client;
            else if (response.content) clientInfo = response.content;
          }
          
          // Vérifier que les informations client sont valides
          if (clientInfo && (clientInfo.id || clientInfo.nom || clientInfo.prenom)) {
            const client: Client = {
              id: clientInfo.id || 0,
              userId: userId,
              nom: clientInfo.nom || '',
              prenom: clientInfo.prenom || '',
              email: clientInfo.email || '',
              telephone: clientInfo.telephone || '',
              adresse: clientInfo.adresse || '',
              ville: clientInfo.ville || '',
              codePostal: clientInfo.codePostal || '',
              pays: clientInfo.pays || 'Tunisie',
              image: clientInfo.image,
              imageUrl: clientInfo.image?.url || clientInfo.imageUrl
            };
            
            return client;
          } else {
            // Si aucune information client valide n'est trouvée, créer un client par défaut
            const defaultClient: Client = {
              id: 0,
              userId: userId,
              nom: '',
              prenom: '',
              email: '',
              telephone: '',
              adresse: '',
              ville: '',
              codePostal: '',
              pays: 'Tunisie',
              image: undefined
            };
            
            return defaultClient;
          }
        }),
        catchError((error: any) => {
          console.error('Erreur lors de la récupération des informations client:', error);
          // En cas d'erreur, retourner un client par défaut
          const defaultClient: Client = {
            id: 0,
            userId: userId,
            nom: '',
            prenom: '',
            email: '',
            telephone: '',
            adresse: '',
            ville: '',
            codePostal: '',
            pays: 'Tunisie',
            image: undefined
          };
          
          return of(defaultClient);
        })
      );
  }

  // Méthode pour mettre à jour les informations du client
  updateClient(client: Client): Observable<Client> {
    // Vérifier si l'ID client est valide
    if (!client.id || client.id === 0) {
      console.error('ID client invalide pour la mise à jour:', client.id);
      
      // Essayer de récupérer l'ID utilisateur
      const userId = client.userId || Number(localStorage.getItem('userId'));
      if (!userId) {
        return throwError(() => new Error('Impossible de mettre à jour le profil: ID client et ID utilisateur invalides'));
      }
      
      console.log('Tentative de mise à jour par ID utilisateur:', userId);
      // Utiliser une URL différente basée sur l'ID utilisateur
      return this.updateClientByUserId(client, userId);
    }
    
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer un objet HttpHeaders pour les en-têtes
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    console.log(`Mise à jour du client avec ID: ${client.id} via l'URL: ${this.apiUrl}/client/${client.id}`);
    
    return this.http.put<any>(`${this.apiUrl}/review/client/${client.id}`, client, httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Réponse de updateClient:', response);
          
          // Extraire les informations client de la réponse
          let updatedClient = response;
          
          // Si la réponse est un objet avec une propriété 'data' ou 'client'
          if (response && typeof response === 'object') {
            if (response.data) updatedClient = response.data;
            else if (response.client) updatedClient = response.client;
            else if (response.content) updatedClient = response.content;
          }
          
          // Mettre à jour le BehaviorSubject avec les nouvelles informations
          this.currentClientSubject.next(updatedClient);
          
          return updatedClient;
        }),
        catchError((error: any) => {
          console.error('Erreur lors de la mise à jour des informations client:', error);
          return throwError(() => error);
        })
      );
  }

  // Méthode pour mettre à jour le client en utilisant l'ID utilisateur
  private updateClientByUserId(client: Client, userId: number): Observable<Client> {
    const token = localStorage.getItem('authToken');
    
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    console.log(`Mise à jour du client par ID utilisateur: ${userId}`);
    
    // Utiliser une URL différente qui accepte les mises à jour par ID utilisateur
    return this.http.put<any>(`${this.apiUrl}/review/client/update-by-user/${userId}`, client, httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Réponse de updateClientByUserId:', response);
          
          let updatedClient = response;
          if (response && typeof response === 'object') {
            if (response.data) updatedClient = response.data;
            else if (response.client) updatedClient = response.client;
            else if (response.content) updatedClient = response.content;
          }
          
          // Si l'ID client est maintenant disponible, le mettre à jour dans le localStorage
          if (updatedClient && updatedClient.id) {
            localStorage.setItem('clientId', updatedClient.id.toString());
          }
          
          this.currentClientSubject.next(updatedClient);
          return updatedClient;
        }),
        catchError((error: any) => {
          console.error('Erreur lors de la mise à jour du client par ID utilisateur:', error);
          
          // Si cette méthode échoue également, essayer une dernière approche
          console.log('Tentative de création/mise à jour du client...');
          return this.createOrUpdateClient(client, userId);
        })
      );
  }
  
  // Méthode de dernier recours pour créer ou mettre à jour un client
  private createOrUpdateClient(client: Client, userId: number): Observable<Client> {
    const token = localStorage.getItem('authToken');
    
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    // Préparer les données client avec l'ID utilisateur
    const clientData = {
      ...client,
      userId: userId
    };
    
    console.log('Tentative de création/mise à jour du client avec les données:', clientData);
    
    // Utiliser une méthode POST pour créer un nouveau client si nécessaire
    return this.http.post<any>(`${this.apiUrl}/review/client/create-or-update`, clientData, httpOptions)
      .pipe(
        map((response: any) => {
          console.log('Réponse de createOrUpdateClient:', response);
          
          let updatedClient = response;
          if (response && typeof response === 'object') {
            if (response.data) updatedClient = response.data;
            else if (response.client) updatedClient = response.client;
            else if (response.content) updatedClient = response.content;
          }
          
          this.currentClientSubject.next(updatedClient);
          return updatedClient;
        }),
        catchError((error: any) => {
          console.error('Erreur lors de la création/mise à jour du client:', error);
          return throwError(() => error);
        })
      );
  }

  // Méthode pour récupérer les informations du client
  getClientInfo(): Client | null {
    return this.currentClientSubject.value;
  }
  
  // Méthode pour définir directement les informations du client
  setCurrentClient(client: Client): void {
    console.log('Définition des informations client:', client);
    this.currentClientSubject.next(client);
    
    // Stocker l'ID client dans localStorage pour les futures utilisations
    if (client && client.id) {
      console.log('Stockage de l\'ID client dans localStorage:', client.id);
      localStorage.setItem('clientId', client.id.toString());
    }
  }
}
