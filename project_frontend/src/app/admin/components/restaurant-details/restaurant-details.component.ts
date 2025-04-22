import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent {
  restaurant = {
    matricule: 1,
    nom: 'Le Gourmet Français',
    email: 'contact@gourmet-francais.com',
    telephone: '01 23 45 67 89',
    localisation: '123 Rue des Délices, Paris',
    description: 'Un cadre élégant proposant une cuisine française réinventée avec des produits locaux et de saison.',
    statut: 'En attente',
    acceptReservation: true,
    livraisonDisponible: true,
    typeCuisine: 'Française',
    gammePrix: '10-50DT',
    Service: ['Wi-Fi gratuit', 'Parking disponible'],
    optionAlimentaires: ['Végétarien', 'Sans gluten'],
    experience: ['Dîner romantique', 'Repas d\'affaires'],
    caracteristiqueRepas: ['Petit-déjeuner', 'Brunch', 'Dîner'],
    accesibilite: ['Accès fauteuil roulant'],
    photoProfil: {
      src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      alt: 'Photo de profil du restaurant'
    },
    imagesParCategories: [
      {
        categorie: 'Extérieur',
        images: [
          { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', alt: 'Terrasse du restaurant' }
        ]
      },
      {
        categorie: 'Plats',
        images: [
          { src: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', alt: 'Plat gastronomique' },
          { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', alt: 'Dessert maison' }
        ]
      },
      {
        categorie: 'Intérieur',
        images: [
          { src: 'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', alt: 'Salle principale' },
          { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', alt: 'Bar' }
        ]
      }
    ],
    complet: false,
    horaireDeTravail: '08:00 - 22:00'
  };

  currentCategoryIndex = 0;
  currentImageIndex = 0;
  safeMapUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const address = encodeURIComponent(this.restaurant.localisation);
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${address}&output=embed&zoom=15`
    );
  }

  prevImage(): void {
    const category = this.restaurant.imagesParCategories[this.currentCategoryIndex];
    this.currentImageIndex = (this.currentImageIndex - 1 + category.images.length) % category.images.length;
  }

  nextImage(): void {
    const category = this.restaurant.imagesParCategories[this.currentCategoryIndex];
    this.currentImageIndex = (this.currentImageIndex + 1) % category.images.length;
  }

  selectCategory(index: number): void {
    this.currentCategoryIndex = index;
    this.currentImageIndex = 0;
  }

  getCurrentImage(): { src: string, alt: string } {
    return this.restaurant.imagesParCategories[this.currentCategoryIndex].images[this.currentImageIndex];
  }

  getCurrentCategory(): string {
    return this.restaurant.imagesParCategories[this.currentCategoryIndex].categorie;
  }
}