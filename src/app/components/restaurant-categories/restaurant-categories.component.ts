import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntrepriseService } from '../../services/entreprise.service';

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
export class RestaurantCategoriesComponent implements OnInit {
  // Définition des catégories avec des valeurs par défaut
  categories: Category[] = [
    { name: 'Français', description: 'Cuisine raffinée et classique française', count: 5, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Italien', description: 'Pâtes, pizzas et spécialités italiennes', count: 6, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Chinois', description: 'Saveurs authentiques de Chine', count: 3, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Japonais', description: 'Sushis, sushimis et plats japonais traditionnels', count: 2, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Tunisien', description: 'Cuisine méditerranéenne aux épices parfumées', count: 4, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Indien', description: 'Currys et plats épicés d\'Inde', count: 5, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Marocain', description: 'Tajines et couscous savoureux', count: 3, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Libanais', description: 'Mézzés et grillades du Moyen-Orient', count: 2, image: 'assets/Images/ramen-7238665_1280.jpg' },
    { name: 'Américain', description: 'Burgers, steaks et spécialités américaines', count: 1, image: 'assets/Images/ramen-7238665_1280.jpg' }
  ];
  
  // Map pour convertir les noms d'enum en noms affichables
  private typeCuisineMap: Record<string, string> = {
    'FRANCAISE': 'Français',
    'ITALIENNE': 'Italien',
    'CHINOISE': 'Chinois',
    'JAPONAISE': 'Japonais',
    'TUNISIENNE': 'Tunisien',
    'INDIENNE': 'Indien',
    'MAROCAINE': 'Marocain',
    'LIBANAISE': 'Libanais',
    'AMERICAINE': 'Américain'
  };
  
  constructor(private entrepriseService: EntrepriseService) {}
  
  ngOnInit(): void {
    this.loadCategoryCounts();
  }
  
  /**
   * Charge le nombre d'entreprises par type de cuisine depuis l'API
   */
  loadCategoryCounts(): void {
    this.entrepriseService.getCountByTypeCuisine().subscribe({
      next: (counts) => {
        console.log('Nombre d\'entreprises par type de cuisine:', counts);
        
        // Mettre à jour les compteurs pour chaque catégorie
        this.categories.forEach(category => {
          // Trouver la clé correspondante dans l'enum
          const enumKey = Object.keys(this.typeCuisineMap).find(
            key => this.typeCuisineMap[key] === category.name
          );
          
          if (enumKey && counts[enumKey] !== undefined) {
            category.count = counts[enumKey];
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du nombre d\'entreprises par type de cuisine:', error);
      }
    });
  }
}
