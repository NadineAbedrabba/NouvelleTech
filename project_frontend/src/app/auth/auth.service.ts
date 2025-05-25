import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/review`;

  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any> {
    const payload = {
      nom: userData.nom,
      email: userData.email,
      password: userData.password
    };
    
    return this.http.post(`${this.apiUrl}/client/register`, payload , 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }

    );
  }

  signUpEntreprise(userData: any): Observable<any> {
   
    
    return this.http.post(`${this.apiUrl}/entreprise/register`, userData , 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }

    );
  }

  authenticate(userData: any): Observable<any> {
    console.log('Tentative d\'authentification avec:', userData);
    return this.http.post(`${this.apiUrl}/authenticate`, userData,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }
    ).pipe(
      tap(response => {
        console.log('Réponse complète d\'authentification:', response);
      })
    );
  }
  
  // Récupérer les informations de l'utilisateur par son ID
  getUserInfo(userId: number): Observable<any> {
    console.log(`Récupération des informations utilisateur pour l'ID: ${userId}`);
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get(`${environment.apiBaseUrl}/review/users/${userId}`, { headers, withCredentials: true });
  }

  // Récupérer les informations du client par l'ID de l'utilisateur
  getClientInfo(userId: number): Observable<any> {
    console.log(`Récupération des informations client pour l'ID utilisateur: ${userId}`);
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : undefined;
    return this.http.get(`${environment.apiBaseUrl}/review/client/by-user/${userId}`, { headers, withCredentials: true });
  }
  
  // Méthode pour décoder le token JWT et extraire les informations utilisateur
  decodeToken(token: string): any {
    try {
      // Le token JWT est composé de trois parties séparées par des points
      // La deuxième partie contient les données (payload)
      const payload = token.split('.')[1];
      // Décoder le payload (qui est en base64)
      const decodedPayload = JSON.parse(atob(payload));
      console.log('Token décodé:', decodedPayload);
      return decodedPayload;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }
  
  // Récupérer les informations du client par email
  getClientByEmail(email: string): Observable<any> {
    // Utiliser l'URL exacte pour récupérer les informations client par email
    return this.http.get(`${environment.apiBaseUrl}/review/client/by-email/${email}`,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }
    ).pipe(
      tap(response => {
        console.log('Réponse de getClientByEmail:', response);
      })
    );
  }

}