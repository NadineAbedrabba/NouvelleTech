import { Component } from '@angular/core';

interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  neighborhood: string;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  restaurants: Restaurant[] = [
    {
      id: 1,
      name: "Le Gourmet Parisien",
      cuisine: "Française",
      rating: 4.7,
      priceRange: "$$$",
      neighborhood: "Quartier Latin",
      imageUrl: "assets/Images/res1.jpg",
      isFavorite: true
    },
    {
      id: 2,
      name: "Sakura Sushi",
      cuisine: "Japonaise",
      rating: 4.5,
      priceRange: "$$",
      neighborhood: "Marais",
      imageUrl: "assets/Images/res2.jpg",
      isFavorite: true
    },
    // Ajoutez d'autres restaurants...
  ];

  // Filtres
  searchQuery: string = '';
  cuisineFilter: string = 'all';
  priceFilter: string = 'all';
  ratingFilter: string = 'all';

  // Options de filtre
  cuisines = ['Française', 'Japonaise', 'Italienne', 'Libanaise', 'Américaine'];
  priceRanges = ['$', '$$', '$$$', '$$$$'];
  
  get filteredRestaurants(): Restaurant[] {
    return this.restaurants.filter(resto => {
      const matchesSearch = resto.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                          resto.neighborhood.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCuisine = this.cuisineFilter === 'all' || resto.cuisine === this.cuisineFilter;
      const matchesPrice = this.priceFilter === 'all' || resto.priceRange === this.priceFilter;
      const matchesRating = this.ratingFilter === 'all' || resto.rating >= parseInt(this.ratingFilter);
      
      return matchesSearch && matchesCuisine && matchesPrice && matchesRating;
    });
  }

  toggleFavorite(restaurant: Restaurant): void {
    restaurant.isFavorite = !restaurant.isFavorite;
    // Ici vous pourriez aussi mettre à jour votre backend
  }
}
