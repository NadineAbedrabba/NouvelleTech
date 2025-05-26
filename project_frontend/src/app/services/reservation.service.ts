import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = 'http://localhost:8081/review/api/reservations';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  private decodeToken(token: string): any {
    if (!token) return null;
  
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      console.log('Decoded token:', decodedPayload);

      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }
  

  getUserReservations(): Observable<any[]> {
    console.log('getUserReservations called');
    const token = localStorage.getItem('token');
    console.log('token:', token);
    if (!token) {
      console.log('No token found');
      return of([]);
    }
    
    const payload = this.decodeToken(token);
    console.log('payload:', payload);
    const clientEmail = payload?.sub;
    console.log('clientEmail:', clientEmail);
  
    if (!clientEmail) {
      console.log('No email found in token');
      return of([]);
    }
  
    const url = `${this.apiUrl}?clientEmail=${encodeURIComponent(clientEmail)}`;
    console.log('Request URL:', url);
  
    return this.http.get<any[]>(url, {
      headers: this.getAuthHeaders()
    });
  }
  

  updateReservation(id: number, reservation: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, reservation, {
      headers: this.getAuthHeaders()
    });
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createReservation(reservation: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('token:', token);
    if (!token) {
      console.log('No token found');
      return of([]);
    }
    
    const payload = this.decodeToken(token);
    const reservationCopy = { ...reservation };
    console.log('payload:', payload);
    const clientEmail = payload?.sub;
    reservationCopy.clientEmail = clientEmail;
    return this.http.post<any>(this.apiUrl, reservationCopy, {
      headers: this.getAuthHeaders()
    });
  }
}
