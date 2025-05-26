import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { LoginSuccessService } from './login-success.service';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginHandlerService {
  private apiUrl = environment.apiBaseUrl;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private loginSuccessService: LoginSuccessService
  ) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/authenticate`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Stocker le token
            localStorage.setItem('authToken', response.token);
            
            // Stocker les informations de l'utilisateur
            if (response.user) {
              this.userService.setCurrentUser(response.user);
              
              // Afficher un message de bienvenue
              const displayName = response.user.prenom || response.user.nom;
              this.loginSuccessService.showWelcomeMessage(displayName);
            }
          }
        })
      );
  }
}
