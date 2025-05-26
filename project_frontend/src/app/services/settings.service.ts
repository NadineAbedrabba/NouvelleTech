import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiBaseUrl}/settings`;

  constructor(private http: HttpClient) { }

  // Récupérer les paramètres d'un client
  getClientSettings(clientId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/${clientId}`, { headers })
      .pipe(
        catchError(this.handleError<any>('getClientSettings', {}))
      );
  }

  // Sauvegarder les paramètres d'un client
  saveClientSettings(clientId: number, settingType: string, settings: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      clientId: clientId,
      settingType: settingType,
      settings: settings
    };

    return this.http.post<any>(`${this.apiUrl}/save`, payload, { headers })
      .pipe(
        catchError(this.handleError<any>('saveClientSettings', {}))
      );
  }

  // Gestionnaire d'erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Retourner un résultat vide pour continuer l'application
      return of(result as T);
    };
  }
}
