import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  email: string;
  nom: string;
  prenom?: string;
  imageUrl?: string;
}

export interface Client {
  id: number;
  userId: number;
  nom: string;
  prenom: string;
  imageUrl?: string;
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
        
        console.log('Informations client extraites dans loadClientInfo:', clientInfo);
        
        // Vérifier que les informations client sont valides
        if (clientInfo && (clientInfo.id || clientInfo.nom || clientInfo.prenom)) {
          const client: Client = {
            id: clientInfo.id || 1, // Utiliser 1 comme valeur par défaut si id n'est pas défini
            userId: userId,
            nom: clientInfo.nom || '',
            prenom: clientInfo.prenom || '',
            imageUrl: clientInfo.imageUrl
          };
          
          console.log('Informations client mises à jour:', client);
          this.currentClientSubject.next(client);
        } else {
          console.warn('Aucune information client valide n\'a été trouvée. Création d\'un client par défaut.');
          this.createDefaultClient(userId);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des informations client:', error);
        // En cas d'erreur, créer un client par défaut pour permettre l'utilisation de l'application
        this.createDefaultClient(userId);
      }
    });
  }
  
  // Méthode pour créer un client par défaut en cas d'erreur ou d'absence de données
  private createDefaultClient(userId: number): void {
    console.log('Création d\'un client par défaut pour l\'utilisateur ID:', userId);
    const user = this.getCurrentUser();
    const defaultClient: Client = {
      id: 1, // ID par défaut pour le développement
      userId: userId,
      nom: user?.nom || 'Utilisateur',
      prenom: user?.prenom || '',
      imageUrl: user?.imageUrl
    };
    console.log('Client par défaut créé:', defaultClient);
    this.currentClientSubject.next(defaultClient);
  }

  // Méthode pour récupérer les informations du client
  getClientInfo(): Client | null {
    return this.currentClientSubject.value;
  }
  
  // Méthode pour définir directement les informations du client
  setCurrentClient(client: Client): void {
    console.log('Définition des informations client:', client);
    this.currentClientSubject.next(client);
  }
}
