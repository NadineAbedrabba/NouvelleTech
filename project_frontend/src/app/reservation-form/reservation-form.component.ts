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
      arrivalTime: ['', Validators.required],  // attention au formControlName dans HTML = arrivalTime
      nbPersonnes: [1, [Validators.required, Validators.min(1)]],
      preference: [''],
      clientNom: ['', Validators.required],
      // clientEmail: ['', [Validators.required, Validators.email]],
      clientTelephone: ['', Validators.required],
    });
  }


  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationData = {
        ...this.reservationForm.value,
        companyId: 2
      };
      this.reservationService.createReservation(reservationData).subscribe({
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
 
}
