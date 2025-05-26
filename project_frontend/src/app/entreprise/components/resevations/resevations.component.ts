import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Reservation {
  id: number;
  date: Date;
  nbPersonnes: number;
  preference: string;
  tempsArrivee: string;
  statut: 'En attente' | 'Confirmée' | 'Annulée';
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent {
  reservations: Reservation[] = [
    {
      id: 1,
      date: new Date(2023, 6, 15, 19, 30),
      nbPersonnes: 4,
      preference: 'Table près de la fenêtre',
      tempsArrivee: '19:30',
      statut: 'En attente'
    },
    {
      id: 2,
      date: new Date(2023, 6, 16, 20, 0),
      nbPersonnes: 2,
      preference: 'Zone non-fumeur',
      tempsArrivee: '20:00',
      statut: 'Confirmée'
    },
    {
      id: 3,
      date: new Date(2023, 6, 17, 18, 45),
      nbPersonnes: 6,
      preference: 'Table spacieuse',
      tempsArrivee: '18:45',
      statut: 'Annulée'
    },
    {
      id: 4,
      date: new Date(2023, 6, 18, 21, 15),
      nbPersonnes: 3,
      preference: 'Aucune',
      tempsArrivee: '21:15',
      statut: 'En attente'
    }
  ];

  filteredReservations: Reservation[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPagesArray: number[] = [];
request: any;

  ngOnInit() {
    this.filterReservations();
  }

  dateFilter: string = '';
statutFilter: string = '';

filterReservations() {
  this.filteredReservations = this.reservations.filter(reservation => {
    const matchesSearch = this.searchText === '' ||
      Object.values(reservation).some(val =>
        val?.toString().toLowerCase().includes(this.searchText.toLowerCase())
      );

    const matchesDate = this.dateFilter === '' || 
      new Date(reservation.date).toISOString().split('T')[0] === this.dateFilter;

    const matchesStatut = this.statutFilter === '' ||
      reservation.statut === this.statutFilter;

    return matchesSearch && matchesDate && matchesStatut;
  });

  this.currentPage = 1;
  this.updateTotalPagesArray();
}

  confirmReservation(id: number): void {
    const reservation = this.reservations.find(res => res.id === id);
    if (reservation) reservation.statut = 'Confirmée';
  }

  cancelReservation(id: number): void {
    const reservation = this.reservations.find(res => res.id === id);
    if (reservation) reservation.statut = 'Annulée';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'En attente': return 'status-pending';
      case 'Confirmée': return 'status-approved';
      case 'Annulée': return 'status-rejected';
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
}
