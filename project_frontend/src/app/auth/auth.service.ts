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

  authenticate(credentials: any): Observable<any> {
    return this.http.post<any>('http://localhost:8081/review/authenticate', credentials).pipe(
      tap(response => {
        if (response.token && response.entrepriseId) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('entrepriseId', response.entrepriseId.toString());
        }
      })
    );
  }
  

}