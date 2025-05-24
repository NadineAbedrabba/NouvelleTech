import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
   
    
    return this.http.post(`${this.apiUrl}/authenticate`, userData,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }
    );
  }

}