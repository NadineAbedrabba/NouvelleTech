import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Category {
  name: string;
  description: string;
  count: number;
  image: string;
}

@Component({
  selector: 'app-restaurant-categories',
  templateUrl: './restaurant-categories.component.html',
  styleUrls: ['./restaurant-categories.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RestaurantCategoriesComponent {
  categories: Category[] = [
    { name: 'Français', description: 'Cuisine raffinée et classique française', count: 25, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Italien', description: 'Pâtes, pizzas et spécialités italiennes', count: 30, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Chinois', description: 'Saveurs authentiques de Chine', count: 22, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Japonais', description: 'Sushis, sushimis et plats japonais traditionnels', count: 28, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Tunisien', description: 'Cuisine méditerranéenne aux épices parfumées', count: 20, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Indien', description: 'Currys et plats épicés d\'Inde', count: 18, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Marocain', description: 'Tajines et couscous savoureux', count: 15, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Libanais', description: 'Mézzés et grillades du Moyen-Orient', count: 12, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Américain', description: 'Burgers, steaks et spécialités américaines', count: 35, image: 'assets/Images/ramen-7238665_1280.jpg' }
  ];
}
