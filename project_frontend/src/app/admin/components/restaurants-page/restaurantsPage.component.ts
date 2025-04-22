import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  description: string;
  imageUrl: string;
  rating: number;
  horaireTravail: string;
  priceRange: string;
}

@Component({
  selector: 'app-restaurants-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurantsPage.component.html',
  styleUrls: ['./restaurantsPage.component.css']
})
export class RestaurantsPageComponent {
  constructor(private router: Router) {}

  restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Le Gourmet Français",
      cuisine: "Française",
      description: "Cuisine traditionnelle française dans un cadre élégant.",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
      rating: 4.7,
      horaireTravail: "08:00-22:00",
      priceRange: "10-50DT"
    },
    {
      id: 2,
      name: "Pasta Amore",
      cuisine: "Italienne",
      description: "Authentiques pâtes italiennes et pizzas au feu de bois.",
      imageUrl: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb",
      rating: 4.5,
      horaireTravail: "08:00-22:00",
      priceRange: "10-70DT"
    },
    {
      id: 3,
      name: "Tokyo Sushi",
      cuisine: "Japonaise",
      description: "Sushi frais préparé quotidiennement.",
      imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
      rating: 4.8,
      horaireTravail: "08:00-22:00",
      priceRange: "10-40DT"
    },
    {
      id: 4,
      name: "Burger Palace",
      cuisine: "Américaine",
      description: "Les meilleurs burgers de la ville.",
      imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      rating: 4.3,
      horaireTravail: "08:00-22:00",
      priceRange: "10-50DT"
    },
    {
      id: 5,
      name: "La Petite Crêperie",
      cuisine: "Française",
      description: "Crêpes sucrées et salées à la minute.",
      imageUrl: "https://images.unsplash.com/photo-1559561723-608b8570f7aa",
      rating: 4.6,
      horaireTravail: "08:00-22:00",
      priceRange: "10-50DT"
    },
    {
      id: 6,
      name: "El Sombrero",
      cuisine: "Mexicaine",
      description: "Tacos et burritos légendaires.",
      imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d",
      rating: 4.4,
      horaireTravail: "08:00-22:00",
      priceRange: "10-50DT"
    }
  ];

  filteredRestaurants: Restaurant[] = [...this.restaurants];
  searchQuery: string = '';
  selectedCuisine: string = 'all';
  selectedPrice: string = 'all';

  cuisineTypes: string[] = [...new Set(this.restaurants.map(r => r.cuisine))];
  priceRanges: string[] = [...new Set(this.restaurants.map(r => r.priceRange))];

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRestaurantId: number | null = null;

  filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            restaurant.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCuisine = this.selectedCuisine === 'all' ||
                            restaurant.cuisine.toLowerCase() === this.selectedCuisine.toLowerCase();
      const matchesPrice = this.selectedPrice === 'all' ||
                           restaurant.priceRange === this.selectedPrice;

      return matchesSearch && matchesCuisine && matchesPrice;
    });
  }

  showContextMenu(event: MouseEvent, restaurantId: number) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.selectedRestaurantId = restaurantId;
    this.contextMenuVisible = true;
  }

  @HostListener('document:click')
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  deleteRestaurant() {
    if (this.selectedRestaurantId && confirm('Êtes-vous sûr de vouloir supprimer ce restaurant ?')) {
      this.restaurants = this.restaurants.filter(r => r.id !== this.selectedRestaurantId);
      this.filterRestaurants();
      this.contextMenuVisible = false;
    }
  }

  viewDetails(id?: number) {
    const restaurantId = id || this.selectedRestaurantId;
    if (restaurantId) {
      this.router.navigate(['/restaurants', restaurantId]);
      this.contextMenuVisible = false;
    }
  }
}
