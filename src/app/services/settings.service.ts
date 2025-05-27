import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Sauvegarder les paramètres d'un client sur le serveur
  saveClientSettings(clientId: number, settingType: string, settings: any): Observable<any> {
    const url = `${this.apiUrl}/clients/${clientId}/settings/${settingType}`;
    return this.http.post(url, settings).pipe(
      catchError(error => {
        console.error(`Erreur lors de la sauvegarde des paramètres ${settingType}:`, error);
        return of({ success: false, error: error.message });
      })
    );
  }

  // Récupérer les paramètres d'un client depuis le serveur
  getClientSettings(clientId: number, settingType: string): Observable<any> {
    const url = `${this.apiUrl}/clients/${clientId}/settings/${settingType}`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error(`Erreur lors de la récupération des paramètres ${settingType}:`, error);
        return of(null);
      })
    );
  }
}
