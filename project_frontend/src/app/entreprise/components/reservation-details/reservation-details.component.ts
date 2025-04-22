// reservation-details.component.ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-reservation-details',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent {
  reservation = {
    id: 7890,
    date: new Date(),
    tempsArrivee: '19:30',
    nbPersonnes: 4,
    preference: 'Table calme avec vue sur le jardin',
    statut: 'En attente',
    clientNom: 'Sophie Martin',
    clientEmail: 'sophie.martin@example.com',
    clientTelephone: '06 12 34 56 78'
  };

  // Ajout d'une propriété pour suivre l'état de confirmation
  isConfirmed = false;
  isRefused = false;

  constructor(private route: ActivatedRoute) {}

  confirmReservation() {
    this.reservation.statut = 'Confirmée';
    this.isConfirmed = true;
    this.isRefused = false;
  }

  cancelReservation() {
    this.reservation.statut = 'Refusée';
    this.isRefused = true;
    this.isConfirmed = false;
  }
}