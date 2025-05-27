import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

interface Reservation {
  id: number;
  createdAt: string;
  reservationDate: string;
  arrivalTime: string;
  nbPersonnes: number;
  preference: string;
  statut: string;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  companyId: number;
  companyName: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPagesArray: number[] = [];
  dateFilter: string = '';
  statutFilter: string = '';
  loading = true;
  error: string | null = null;
  entrepriseId: any;
  errorMessage: string | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params: { [x: string]: string | number; }) => {
      this.entrepriseId = +params['id'];
      console.log('ID profil from route:', this.entrepriseId);
      
      if (isNaN(this.entrepriseId)) {
        this.errorMessage = 'ID entreprise invalide';
        return;
      }
      
      this.fetchReservations();
    });
  }

  fetchReservations(): void {
    this.http.get<Reservation[]>(`http://localhost:8081/review/api/reservations/company/${this.entrepriseId}`)
      .pipe(
        catchError(err => {
          this.error = 'Échec du chargement des réservations';
          this.loading = false;
          return throwError(err);
        })
      )
      .subscribe(reservations => {
        this.reservations = reservations;
        this.filterReservations();
        this.loading = false;
      });
  }

  filterReservations() {
    this.filteredReservations = this.reservations.filter(reservation => {
      const matchesSearch = this.searchText === '' ||
        Object.values(reservation).some(val =>
          val?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        );

      const matchesDate = this.dateFilter === '' || 
        new Date(reservation.createdAt).toISOString().split('T')[0] === this.dateFilter;

      const matchesStatut = this.statutFilter === '' ||
        reservation.statut === this.statutFilter;

      return matchesSearch && matchesDate && matchesStatut;
    });

    this.currentPage = 1;
    this.updateTotalPagesArray();
  }

  confirmReservation(id: number): void {
    const reservation = this.reservations.find(res => res.id === id);
    if (!reservation) return;
  
    this.http.put<Reservation>(`http://localhost:8081/review/api/reservations/${id}/confirm`, {})
      .pipe(
        catchError(err => {
          this.error = 'Échec de la confirmation de la réservation';
          return throwError(err);
        })
      )
      .subscribe(updatedReservation => {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
          this.filterReservations();
        }
      });
  }
  
  cancelReservation(id: number): void {
    const reservation = this.reservations.find(res => res.id === id);
    if (!reservation) return;
  
    this.http.put<Reservation>(`http://localhost:8081/review/api/reservations/${id}/refuse`, {})
      .pipe(
        catchError(err => {
          this.error = 'Échec du refus de la réservation';
          return throwError(err);
        })
      )
      .subscribe(updatedReservation => {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index !== -1) {
          this.reservations[index] = updatedReservation;
          this.filterReservations();
        }
      });
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'EN_ATTENTE': return 'status-pending';
      case 'CONFIRMEE': return 'status-approved';
      case 'REFUSEE': return 'status-rejected';
      default: return '';
    }
  }

  get paginatedReservations(): Reservation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservations.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  updateTotalPagesArray(): void {
    this.totalPagesArray = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}