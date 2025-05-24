import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant } from '../../../models/restaurant.model';
import { finalize, map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-restaurant-requests',
  templateUrl: './restaurant-requests.component.html',
  styleUrls: ['./restaurant-requests.component.css'],
  standalone:true,
  imports:[FormsModule, CommonModule,RouterModule
  ]
})
export class RestaurantRequestsComponent implements OnInit {
  restaurantRequests: Restaurant[] = [];
  filteredRequests: Restaurant[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  isLoading: boolean = false;
  totalPagesArray: number[] = [];

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit() {
    this.loadPendingRestaurants();
  }

  loadPendingRestaurants(): void {
    this.isLoading = true;
    this.restaurantService.getPendingRestaurants()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (restaurants) => {
          console.log('Données reçues:', restaurants); // Debug
          this.restaurantRequests = restaurants;
          this.filterRequests();
        },
        error: (err) => {
          console.error('Erreur lors du chargement:', err);
        }
      });
  }

  filterRequests(): void {
    if (!this.restaurantRequests) {
      this.filteredRequests = [];
      return;
    }
  
    this.filteredRequests = this.restaurantRequests.filter(request => {
      // Vérifiez d'abord si request existe
      if (!request) return false;
      
      // Recherche insensible à la casse
      const searchLower = this.searchText.toLowerCase();
      
      return (
        this.searchText === '' ||
        (request.nomEntreprise && request.nomEntreprise.toLowerCase().includes(searchLower)) ||
        (request.email && request.email.toLowerCase().includes(searchLower)) ||
        (request.telephone && request.telephone.includes(this.searchText)) ||
        (request.adresse && request.adresse.toLowerCase().includes(searchLower)) ||
        (request.typeCuisine && request.typeCuisine.toLowerCase().includes(searchLower))
      );
    });
  
    this.currentPage = 1;
    this.updateTotalPagesArray();
  }

  acceptRequest(id: number): void {
    this.isLoading = true;
    this.restaurantService.updateRestaurantStatus(id, 'ACCEPTEE')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updatedRestaurant) => {
          const index = this.restaurantRequests.findIndex(r => r.id === id);
          if (index !== -1) {
            this.restaurantRequests[index] = updatedRestaurant;
            this.filterRequests();
          }
        },
        error: (err) => console.error('Erreur:', err)
      });
      
  }

  rejectRequest(id: number): void {
    this.isLoading = true;
    this.restaurantService.updateRestaurantStatus(id, 'NON_ACCEPTEE')
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (updatedRestaurant) => {
          const index = this.restaurantRequests.findIndex(r => r.id === id);
          if (index !== -1) {
            this.restaurantRequests[index] = updatedRestaurant;
            this.filterRequests();
          }
        },
        error: (err) => console.error('Erreur:', err)
      });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'EN_ATTENTE': return 'status-pending';
      case 'ACCEPTEE': return 'status-approved';
      case 'NON_ACCEPTEE': return 'status-rejected';
      default: return '';
    }
  }

  get paginatedRequests(): Restaurant[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredRequests.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
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