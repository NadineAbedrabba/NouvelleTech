import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationService } from '../services/reservation.service';


interface Reservation {
  id: string;
  reservationDate: string;
  requestDate: string;
  nbPersonnes: number;
  preference: string;
  tempsArrive: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}
@Component({
  selector: 'app-mes-reservations',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './mes-reservations.component.html',
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  styleUrls: ['./mes-reservations.component.css']
})
export class MesReservationsComponent implements OnInit {
  animationState = 'initial';
  activeFilter = 'all';
  showEditModal = false;
  currentReservation: Reservation | null = null;
  editForm: FormGroup;
  today: string;
  reservations: Reservation[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private reservationService: ReservationService
  ) 
  {
    this.today = new Date().toISOString().split('T')[0];
    this.editForm = this.fb.group({
      reservationDate: ['', Validators.required],
      nbPersonnes: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      tempsArrive: ['19:00', Validators.required],
      preference: ['']
    });
  }


  filteredReservations: Reservation[] = [];

  ngOnInit(): void {
    this.filterReservations('all');
    this.animationState = 'loaded';
    this.reservationService.getUserReservations().subscribe({
      next: (data) => {
        this.reservations = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des réservations :', err);
      }
    });
  }
  

  filterReservations(filter: string): void {
    this.activeFilter = filter;
    switch (filter) {
      case 'confirmed':
        this.filteredReservations = this.reservations.filter(r => r.status === 'CONFIRMED');
        break;
      case 'pending':
        this.filteredReservations = this.reservations.filter(r => r.status === 'PENDING');
        break;
      case 'cancelled':
        this.filteredReservations = this.reservations.filter(r => r.status === 'CANCELLED');
        break;
      default:
        this.filteredReservations = [...this.reservations];
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Confirmée';
      case 'PENDING': return 'En attente';
      case 'CANCELLED': return 'Annulée';
      default: return '';
    }
  }

  modifyReservation(reservation: Reservation): void {
    this.currentReservation = reservation;
    this.editForm.patchValue({
      reservationDate: reservation.reservationDate,
      nbPersonnes: reservation.nbPersonnes,
      tempsArrive: reservation.tempsArrive,
      preference: reservation.preference
    });
    this.showEditModal = true;
  }
  submitUpdate(): void {
    if (this.currentReservation && this.editForm.valid) {
      const updatedReservation = this.editForm.value;
  
      this.reservationService.updateReservation(+this.currentReservation.id, updatedReservation)
        .subscribe({
          next: (response) => {
            console.log('Mise à jour réussie', response);
            this.showEditModal = false;
            // Met à jour localement la réservation modifiée si nécessaire
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour', err);
          }
        });
    }
  }
  

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentReservation = null;
  }
  cancelReservation(reservation: Reservation): void {
    console.log('Annuler réservation:', reservation);
    if (confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      this.reservationService.cancelReservation(+reservation.id).subscribe({
        next: () => {
          reservation.status = 'CANCELLED';
  
          
          alert('Réservation annulée avec succès.');
        },
        error: err => {
          console.error('Erreur lors de l\'annulation', err);
          alert('Erreur lors de l\'annulation de la réservation.');
        }
      });
    }  }

}
