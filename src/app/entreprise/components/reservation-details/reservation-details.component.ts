import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {
  reservation: any;
  isConfirmed = false;
  isRefused = false;
  error: string | null = null;
  entrepriseId: number | undefined;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.entrepriseId = +parentParams['id'];
      
      const reservationId = this.route.snapshot.paramMap.get('reservationId');
      if (reservationId) {
        this.fetchReservation(reservationId);
      } else {
        this.error = "ID de réservation introuvable dans l'URL.";
      }
    });
  }

  fetchReservation(id: string) {
    this.http.get(`http://localhost:8081/review/api/reservations/${id}`)
      .subscribe({
        next: (data) => {
          this.reservation = data;

          // Fusionner date + heure si nécessaire
          if (this.reservation.reservationDate && this.reservation.arrivalTime) {
            this.reservation.fullDateTime = new Date(
              `${this.reservation.reservationDate}T${this.reservation.arrivalTime}`
            );
          }
        },
        error: () => {
          this.error = "Erreur lors du chargement de la réservation.";
        }
      });
  }

  confirmReservation() {
    if (!this.reservation?.id) return;

    this.http.put(`http://localhost:8081/review/api/reservations/${this.reservation.id}/confirm`, {})
      .subscribe({
        next: () => {
          this.reservation.statut = 'Confirmée';
          this.isConfirmed = true;
          this.isRefused = false;
        },
        error: () => {
          this.error = "Échec de la confirmation de la réservation.";
        }
      });
  }

  cancelReservation() {
    if (!this.reservation?.id) return;

    this.http.put(`http://localhost:8081/review/api/reservations/${this.reservation.id}/refuse`, {})
      .subscribe({
        next: () => {
          this.reservation.statut = 'Refusée';
          this.isRefused = true;
          this.isConfirmed = false;
        },
        error: () => {
          this.error = "Échec de l'annulation de la réservation.";
        }
      });
  }
}
