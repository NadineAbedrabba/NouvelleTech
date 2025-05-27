import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  companyId: number | null = null;  // bien typer companyId
  restaurantId!: string;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  }

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      arrivalTime: ['', Validators.required],  // correspond à formControlName dans HTML
      nbPersonnes: [1, [Validators.required, Validators.min(1)]],
      preference: [''],
      clientNom: ['', Validators.required],
      clientTelephone: ['', Validators.required],
    });

    this.companyId = Number(this.route.snapshot.queryParamMap.get('id'));


    // Exemple récupération d’un paramètre de route si besoin (pas utilisé ici)
    // this.restaurantId = this.route.snapshot.paramMap.get('id')!;
  }
onSubmit(): void {
  if (this.reservationForm.valid) {
    if (!this.companyId) {
      alert('ID de la société invalide ou manquant');
      return;
    }

    const reservationData = {
      ...this.reservationForm.value,
      companyId: this.companyId
    };

    this.reservationService.createReservation(reservationData).subscribe({
      next: () => {
        alert('Réservation créée avec succès !');
        this.reservationForm.reset();
      },
      error: (err) => {
        console.error('Erreur création réservation', err);
        alert('Erreur lors de la création de la réservation.');
      }
    });
  }
}}