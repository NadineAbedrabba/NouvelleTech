import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ReservationService } from '../services/reservation.service';

enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED'
}


@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  submitted = false;
  status: ReservationStatus = ReservationStatus.PENDING;
  today: string;
  
  reservationDate: string = '';
  tempsArrive: string = '';

  constructor(private fb: FormBuilder , private reservationService : ReservationService) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    
  }

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      nbPersonnes: [2, [Validators.required, Validators.min(1), Validators.max(20)]],
      tempsArrive: ['19:00', Validators.required],
      preference: ['']
    });
  }


  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.reservationService.createReservation(this.reservationForm.value).subscribe({
        next: (res) => {
          alert('Réservation créée avec succès !');
          this.reservationForm.reset();
          // Eventuellement, rediriger ou mettre à jour la liste
        },
        error: (err) => {
          console.error('Erreur création réservation', err);
          alert('Erreur lors de la création de la réservation.');
        }
      });
    }}
  newReservation() {
    this.submitted = false;
    this.status = ReservationStatus.PENDING;
    this.reservationForm.reset({
      nbPersonnes: 2,
      tempsArrive: '19:00'
    });
  }
}
