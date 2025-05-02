import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurants-page',
  templateUrl: './restaurantsPage.component.html',
  styleUrls: ['./restaurantsPage.component.css'],
  standalone:true,
  imports:[FormsModule, RouterModule, CommonModule]
})



export class RestaurantsPageComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  cuisineTypes: string[] = [];
  priceRanges: string[] = [];
  searchQuery = '';
  selectedCuisine = 'all';
  selectedPrice = 'all';


  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRestaurantId: number | null = null;

  constructor(private restaurantService: RestaurantService, private router: Router) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe(data => {
      this.restaurants = data;
      this.filteredRestaurants = [...data];
      this.extractFilterOptions();
      this.loadProfileImages();
    });
  }

  extractFilterOptions(): void {
    this.cuisineTypes = [...new Set(this.restaurants.map(r => r.typeCuisine))];
    this.priceRanges = [...new Set(this.restaurants.map(r => r.gammePrix))];
  }

  filterRestaurants(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesQuery = restaurant.nomEntreprise.toLowerCase().includes(query)
        || (restaurant.description && restaurant.description.toLowerCase().includes(query));
      const matchesCuisine = this.selectedCuisine === 'all' || restaurant.typeCuisine === this.selectedCuisine;
      const matchesPrice = this.selectedPrice === 'all' || restaurant.gammePrix === this.selectedPrice;
      return matchesQuery && matchesCuisine && matchesPrice;
    });
  }

  loadProfileImages(): void {
    this.restaurants.forEach(restaurant => {
      this.restaurantService.getProfileImage(restaurant.id).subscribe(images => {
        if (images && images.length > 0) {
          restaurant.profileImage = images[0];
        } else {
          restaurant.profileImage = null;
        }
      });
    });
  }

  viewDetails(id?: number): void {
    if (id) {
      this.router.navigate(['/restaurants', id]);
    }
  }
  
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/background.png';
  }
  


  showContextMenu(event: MouseEvent, id: number): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.selectedRestaurantId = id;
  }

  @HostListener('document:click')
  hideContextMenu(): void {
    this.contextMenuVisible = false;
  }

  deleteRestaurant(): void {
    if (this.selectedRestaurantId !== null) {
      this.restaurants = this.restaurants.filter(r => r.id !== this.selectedRestaurantId);
      this.filterRestaurants();
      this.contextMenuVisible = false;
    }
}
}
