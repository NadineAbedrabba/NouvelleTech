import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ReservationService {

  private apiUrl = 'http://localhost:8081/review/reservations';

  constructor(private http: HttpClient) {}

  getUserReservations(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  updateReservation(id: number, reservation: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, reservation);
  }
  cancelReservation(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/cancel`, null);
  }
  createReservation(reservation: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reservation);
  }

}