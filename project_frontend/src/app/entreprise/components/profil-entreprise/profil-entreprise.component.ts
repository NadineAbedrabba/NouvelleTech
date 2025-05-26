import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.scss']
})
export class RestaurantProfileComponent {
  showModal = false;
  showAvatarModal = false;
  currentEditSection = '';
  tempData: any = {};
  newCategoryName = '';
  newImageUrl = '';
  newImageAlt = '';
  selectedCategory = '';
  avatarPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  galleryFile: File | null = null;
  galleryPreview: string | ArrayBuffer | null = null;

  restaurant = {
    matricule: 1,
    nom: 'Le Gourmet Français',
    email: 'contact@gourmet-francais.com',
    telephone: '01 23 45 67 89',
    localisation: '123 Rue des Délices, Paris',
    description: 'Un cadre élégant proposant une cuisine française réinventée avec des produits locaux et de saison.',
    statut: 'En attente',
    complet: false, // Nouvel attribut
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
      }
    ],
    horaireDeTravail: '08:00 - 22:00'
  };

  toggleRestaurantStatus() {
    this.restaurant.complet = !this.restaurant.complet;
    // Ajouter ici la logique de sauvegarde si nécessaire
  }

  // Méthodes pour la modal principale
  openEditModal(section: string): void {
    this.currentEditSection = section;
    this.tempData = JSON.parse(JSON.stringify(this.restaurant));
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetGalleryUpload();
  }

  saveChanges(): void {
    this.restaurant = JSON.parse(JSON.stringify(this.tempData));
    this.closeModal();
  }

  // Méthodes pour l'avatar
  openEditAvatarModal(): void {
    this.showAvatarModal = true;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.resetAvatarModal();
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveAvatarChanges(): void {
    if (this.avatarPreview) {
      this.restaurant.photoProfil = {
        src: this.avatarPreview as string,
        alt: 'Nouvelle photo de profil'
      };
      this.closeAvatarModal();
    }
  }

  resetAvatarModal(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Méthodes pour la galerie
  handleGalleryFileInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.galleryFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.galleryPreview = e.target?.result as string;
        this.newImageUrl = this.galleryPreview as string;
      };
      reader.readAsDataURL(file);
    }
  }


  resetGalleryUpload(): void {
    this.newImageUrl = '';
    this.newImageAlt = '';
    this.galleryFile = null;
    this.galleryPreview = null;
    const fileInput = document.getElementById('galleryUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }


  // Méthodes pour les services
  addService(newService: string): void {
    if (newService && !this.tempData.Service.includes(newService)) {
      this.tempData.Service = [...this.tempData.Service, newService];
    }
  }

  removeService(service: string): void {
    this.tempData.Service = this.tempData.Service.filter((s: string) => s !== service);
  }

  // Méthodes pour les options alimentaires
  addOption(newOption: string): void {
    if (newOption && !this.tempData.optionAlimentaires.includes(newOption)) {
      this.tempData.optionAlimentaires = [...this.tempData.optionAlimentaires, newOption];
    }
  }

  removeOption(option: string): void {
    this.tempData.optionAlimentaires = this.tempData.optionAlimentaires.filter((o: string) => o !== option);
  }

  // Méthodes pour les expériences
  addExperience(newExperience: string): void {
    if (newExperience && !this.tempData.experience.includes(newExperience)) {
      this.tempData.experience = [...this.tempData.experience, newExperience];
    }
  }

  removeExperience(experience: string): void {
    this.tempData.experience = this.tempData.experience.filter((e: string) => e !== experience);
  }

  // Méthodes pour les caractéristiques repas
  addMeal(newMeal: string): void {
    if (newMeal && !this.tempData.caracteristiqueRepas.includes(newMeal)) {
      this.tempData.caracteristiqueRepas = [...this.tempData.caracteristiqueRepas, newMeal];
    }
  }

  removeMeal(meal: string): void {
    this.tempData.caracteristiqueRepas = this.tempData.caracteristiqueRepas.filter((m: string) => m !== meal);
  }

  // Méthodes pour l'accessibilité
  addAccessibility(newAccess: string): void {
    if (newAccess && !this.tempData.accesibilite.includes(newAccess)) {
      this.tempData.accesibilite = [...this.tempData.accesibilite, newAccess];
    }
  }

  removeAccessibility(access: string): void {
    this.tempData.accesibilite = this.tempData.accesibilite.filter((a: string) => a !== access);
  }

  // Méthodes pour la galerie
  addImageCategory(): void {
    if (this.newCategoryName && !this.tempData.imagesParCategories.some((c: any) => c.categorie === this.newCategoryName)) {
      this.tempData.imagesParCategories.push({
        categorie: this.newCategoryName,
        images: []
      });
      this.newCategoryName = '';
    }
  }

  removeImageCategory(category: string): void {
    this.tempData.imagesParCategories = this.tempData.imagesParCategories.filter((c: any) => c.categorie !== category);
  }

  addImageToCategory(): void {
    if (this.selectedCategory && this.newImageUrl) {
      const category = this.tempData.imagesParCategories.find((c: any) => c.categorie === this.selectedCategory);
      if (category) {
        category.images.push({
          src: this.newImageUrl,
          alt: this.newImageAlt || 'Image du restaurant'
        });
        this.newImageUrl = '';
        this.newImageAlt = '';
      }
    }
  }

  removeImageFromCategory(category: string, index: number): void {
    const cat = this.tempData.imagesParCategories.find((c: any) => c.categorie === category);
    if (cat) {
      cat.images.splice(index, 1);
    }
  }
}