import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface RestaurantRequest {
  matricule: number;
  nom: string;
  email: string;
  telephone: string;
  localisation: string;
  statut: 'En attente' | 'Acceptée' | 'Rejetée';
  typeCuisine: string;
  dateDemande: Date; // J'ai retiré gammePrix de l'interface
}

@Component({
  selector: 'app-restaurant-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurant-requests.component.html',
  styleUrls: ['./restaurant-requests.component.css']
})
export class RestaurantRequestsComponent {
  restaurantRequests: RestaurantRequest[] = [
    {
      matricule: 1,
      nom: 'Le Gourmet Français',
      email: 'contact@gourmet-francais.com',
      telephone: '01 23 45 67 89',
      localisation: 'Paris, France',
      statut: 'En attente',
      dateDemande: new Date(2023, 5, 15),
      typeCuisine: ''
    },
    {
      matricule: 2,
      nom: 'Bella Italia',
      email: 'contact@bella-italia.com',
      telephone: '06 12 34 56 78',
      localisation: 'Lyon, France',
      statut: 'En attente',
      typeCuisine: 'Italienne',
      dateDemande: new Date(2023, 5, 10)
    },
    {
      matricule: 3,
      nom: 'Tokyo Sushi',
      email: 'contact@tokyo-sushi.com',
      telephone: '07 89 01 23 45',
      localisation: 'Marseille, France',
      statut: 'En attente',
      typeCuisine: 'Japonaise',
      dateDemande: new Date(2023, 4, 28)
    },
    {
      matricule: 4,
      nom: 'Burger Palace',
      email: 'contact@burger-palace.com',
      telephone: '05 67 89 01 23',
      localisation: 'Toulouse, France',
      statut: 'Rejetée',
      typeCuisine: 'Américaine',
      
      dateDemande: new Date(2023, 4, 20)
    }
  ];

  filteredRequests: RestaurantRequest[] = [];
  searchText: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 3;
  dateFilter: string = '';
  totalPagesArray: number[] = [];

  ngOnInit() {
    this.filterRequests();
  }

  filterRequests() {
    this.filteredRequests = this.restaurantRequests.filter(request => {
      const matchesSearch = this.searchText === '' || 
        Object.values(request).some(val => 
          val?.toString().toLowerCase().includes(this.searchText.toLowerCase())
        );
      
      
      
      return matchesSearch
    });
    
    this.currentPage = 1;
    this.updateTotalPagesArray();
  }

 

  acceptRequest(matricule: number): void {
    const request = this.restaurantRequests.find(req => req.matricule === matricule);
    if (request) request.statut = 'Acceptée';
  }

  rejectRequest(matricule: number): void {
    const request = this.restaurantRequests.find(req => req.matricule === matricule);
    if (request) request.statut = 'Rejetée';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'En attente': return 'status-pending';
      case 'Acceptée': return 'status-approved';
      case 'Rejetée': return 'status-rejected';
      default: return '';
    }
  }

  get paginatedRequests(): RestaurantRequest[] {
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