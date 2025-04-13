import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/review';

  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any> {
    // On envoie seulement le premier password
    const payload = {
      name: userData.name,
      email: userData.email,
      password: userData.password
    };
    
    return this.http.post(`${this.apiUrl}/sign-up`, payload , 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }

    );
  }

  authenticate(userData: any): Observable<any> {
   
    
    return this.http.post(`${this.apiUrl}/authenticate`, userData,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true }
    );
  }

}
