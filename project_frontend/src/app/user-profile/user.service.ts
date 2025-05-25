import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    this.http.get<any>(`${this.apiUrl}/review/client/by-user/${userId}`).subscribe({
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
        if (clientInfo && (clientInfo.nom || clientInfo.prenom)) {
          const client: Client = {
            id: clientInfo.id || 0,
            userId: userId,
            nom: clientInfo.nom || '',
            prenom: clientInfo.prenom || '',
            imageUrl: clientInfo.imageUrl
          };
          
          console.log('Informations client mises à jour:', client);
          this.currentClientSubject.next(client);
        } else {
          console.warn('Aucune information client valide n\'a été trouvée');
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des informations client:', error);
      }
    });
  }

  // Méthode pour récupérer les informations du client
  getClientInfo(): Client | null {
    return this.currentClientSubject.value;
  }
}
