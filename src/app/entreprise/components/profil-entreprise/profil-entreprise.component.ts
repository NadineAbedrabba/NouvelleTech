import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService, EntrepriseDto } from '../../../services/restaurant.service';
import { Image } from '../../../models/restaurant.model';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-restaurant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil-entreprise.component.html',
  styleUrls: ['./profil-entreprise.component.scss']
})
export class RestaurantProfileComponent implements OnInit {
  showModal = false;
  showAvatarModal = false;
  currentEditSection: string = '';
  tempData: Partial<EntrepriseDto> = {};
  newCategoryName = '';
  newImageAlt = '';
  selectedCategory = '';
  avatarPreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  galleryFile: File | null = null;
  galleryPreview: string | ArrayBuffer | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isSavingStatus = false;
  entrepriseId = 71;
  horairesTrans: string = '';

  restaurant: EntrepriseDto = {
    id: 0,
    nomEntreprise: '',
    matricule: '',
    email: '',
    telephone: '',
    description: '',
    adresse: '',
    typeCuisine: '',
    statut: 'EN_ATTENTE',
    dateDemande: new Date(),
    complet: false,
    services: [],
    optionsAlimentaires: [],
    experiences: [],
    caracteristiqueRepas: [],
    accesibilite: [],
    images: [],
    imagesParCategories: [],
    photoProfil: { src: '', alt: '' },
    horaires: [],
    profileImage: undefined,
    gammePrix: undefined,
    horaireDeTravail: undefined,
    localisation: undefined,
    livraisonDisponible: false,
    acceptReservation: false,
    rating: undefined
  };
horairesText: any;

  constructor(private restaurantService: RestaurantService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute // Ajoutez ceci
  ) {}

  

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.entrepriseId = +params['id'];
      console.log('ID profil from route:', this.entrepriseId);
      
      if (isNaN(this.entrepriseId)) {
        this.errorMessage = 'ID entreprise invalide';
        return;
      }
      
      this.loadRestaurantData();
    });
  }

  loadRestaurantData(): void {
    this.restaurantService.getRestaurantDetails(this.entrepriseId).subscribe({
      next: (data) => {
        // Trouver l'image de profil
        const profileImage = data.images?.find(img => img.categorie === 'Profil');
        
        this.restaurant = {
          ...data,
          photoProfil: profileImage 
            ? { src: this.getImageUrl(profileImage.lien), alt: 'Photo de profil' } 
            : { src: 'assets/profilClient.jpg', alt: 'Photo par défaut' },
          imagesParCategories: this.groupImagesByCategory(data.images || []),
          horaires: data.horaires || [], 
        };
        this.horairesTrans = this.formatHoraires(this.restaurant.horaires)
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Échec du chargement des données du restaurant. Veuillez réessayer.';
      }
    });
  }



  






  toggleRestaurantStatus(): void {
    this.isSavingStatus = true;
    const newStatus = !this.restaurant.complet;
    
    this.restaurantService.updateCompletStatus(this.entrepriseId, newStatus).subscribe({
      next: (updatedRestaurant) => {
        this.restaurant.complet = updatedRestaurant.complet;
        this.errorMessage = null;
        this.successMessage = `Statut mis à jour : ${newStatus ? 'Complet' : 'Disponible'}`;
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Échec de la mise à jour du statut. Veuillez réessayer.';
        console.error('Erreur:', err);
      },
      complete: () => {
        this.isSavingStatus = false;
      }
    });
  }

  getImageUrl(lien: string): string {
    if (!lien) {
      return 'assets/profilClient.jpg';
    }
    
    // Si c'est une URL externe
    if (lien.startsWith('http://') || lien.startsWith('https://')) {
      return lien;
    }
    
    // Si le lien contient déjà une partie du chemin
    if (lien.includes('review/api/images/files')) {
      const cleanPath = lien.replace(/^\/+/, '');
      return `http://localhost:8081/${cleanPath}?t=${Date.now()}`; // Ajout du timestamp
    }
    
    // Si c'est juste un nom de fichier
    return `http://localhost:8081/review${lien}?t=${Date.now()}`;
  }

  groupImagesByCategory(images: Image[]): { categorie: string; images: { id?: number; src: string; alt: string }[] }[] {
    if (!images || images.length === 0) {
      return [{
        categorie: 'Galerie',
        images: [{
          src: 'assets/profilClient.jpg',
          alt: 'Aucune image disponible'
        }]
      }];
    }

    const categories = new Map<string, { id?: number; src: string; alt: string }[]>();
    
    images.forEach(image => {
      const category = image.categorie || 'Galerie';
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      
      const src = this.getImageUrl(image.lien);
      categories.get(category)!.push({
        id: image.id,
        src: src,
        alt: image.categorie || `Image ${category}`
      });
    });

    return Array.from(categories.entries()).map(([categorie, images]) => ({
      categorie,
      images
    }));
  }

  addImageToCategory(): void {
    if (!this.selectedCategory || !this.galleryFile || !this.tempData.imagesParCategories) {
      this.errorMessage = 'Veuillez sélectionner une catégorie et une image.';
      return;
    }

    this.restaurantService.uploadImage(this.entrepriseId, this.selectedCategory, this.galleryFile).subscribe({
      next: (image) => {
        const category = this.tempData.imagesParCategories!.find(c => c.categorie === this.selectedCategory);
        if (category) {
          category.images.push({ 
            id: image.id,
            src: this.getImageUrl(image.lien),
            alt: image.categorie || `Image ${this.selectedCategory}` 
          });
          this.restaurant.images = [...(this.restaurant.images || []), image];
          this.restaurant.imagesParCategories = this.groupImagesByCategory(this.restaurant.images);
          this.resetGalleryUpload();
          this.errorMessage = null;
          this.successMessage = 'Image ajoutée avec succès.';
          setTimeout(() => this.successMessage = null, 3000);
        }
      },
      error: (err) => {
        this.errorMessage = err.message || 'Échec du téléchargement de l\'image. Vérifiez si le serveur est en cours d\'exécution.';
        console.error('Erreur:', err);
      }
    });
  }

  handleImageError(event: Event, lien: string): void {
    console.error(`Failed to load image: ${lien}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profilClient.jpg';
    imgElement.onerror = null;
  }

  resetGalleryUpload(): void {
    this.galleryPreview = null;
    this.galleryFile = null;
    this.newImageAlt = '';
    const fileInput = document.getElementById('galleryUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  removeImageFromMainGallery(category: string, index: number): void {
    const cat = this.restaurant.imagesParCategories?.find(c => c.categorie === category);
    const imageId = cat?.images[index]?.id;
    
    if (!imageId) {
      cat?.images.splice(index, 1);
      return;
    }

    this.restaurantService.deleteImage(imageId).subscribe({
      next: () => {
        cat?.images.splice(index, 1);
        this.errorMessage = null;
        this.restaurant.images = this.restaurant.images?.filter(img => img.id !== imageId) || [];
        this.successMessage = 'Image supprimée avec succès.';
        setTimeout(() => this.successMessage = null, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Échec de la suppression de l\'image. Veuillez réessayer.';
        console.error('Erreur:', err);
      }
    });
  }
  formatHoraires(horairesData: any): string {
    if (!horairesData || typeof horairesData !== 'object') {
      console.warn('Données d\'horaires invalides:', horairesData);
      return 'Horaires non spécifiés';
    }
  
    const ordreJours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
    return ordreJours
      .map(jour => {
        const h = horairesData[jour];
        if (!h || (!h.heureOuverture && !h.heureFermeture && !h.estFerme)) {
          console.log(`Jour ${jour} non spécifié:`, h);
          return `${jour} : Non spécifié`;
        }
        if (h.estFerme) {
          console.log(`Jour ${jour} fermé:`, h);
          return `${jour} : Fermé`;
        }
        if (h.heureOuverture && h.heureFermeture) {
          console.log(`Jour ${jour} avec horaires:`, h);
          return `${jour} : ${h.heureOuverture} - ${h.heureFermeture}`;
        }
        console.log(`Jour ${jour} non spécifié (par défaut):`, h);
        return `${jour} : Non spécifié`;
      })
      .join('\n');
  }
  // Dans votre composant (profil-entreprise.component.ts)
onHorairesChange(newHoraires: any): void {
  // Vous pouvez ajouter ici une logique de validation si nécessaire
  this.tempData.horaires = newHoraires;
}
openEditModal(section: string): void {
  this.currentEditSection = section;
  this.tempData = JSON.parse(JSON.stringify(this.restaurant)); // Deep copy
  this.horairesText = this.formatHoraires(this.tempData.horaires); // Formatage initial
  if (!this.tempData.imagesParCategories) {
    this.tempData.imagesParCategories = this.groupImagesByCategory(this.tempData.images || []);
  }
  this.tempData.acceptReservation = this.restaurant.acceptReservation;
  this.tempData.livraisonDisponible = this.restaurant.livraisonDisponible;
  this.showModal = true;
  this.errorMessage = null;
  this.cdRef.detectChanges(); // Forcer la mise à jour de l'UI
}
  closeModal(): void {
    this.showModal = false;
    this.resetGalleryUpload();
    this.errorMessage = null;
  }

  isFormValid(): boolean {
    if (this.currentEditSection === 'contact') {
      const lignes = this.horairesText.split('\n').map((ligne: string) => ligne.trim()).filter((ligne: any) => ligne);
      const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
      for (const ligne of lignes) {
        const match = ligne.match(/^(\w+)\s*:\s*(.*)$/);
        if (!match) {
          this.errorMessage = `Format invalide pour la ligne : ${ligne}`;
          return false;
        }
        const jour = match[1].trim();
        const partieHeures = match[2].trim();
  
        if (!jours.includes(jour)) {
          this.errorMessage = `Jour invalide : ${jour}`;
          return false;
        }
  
        if (
          !partieHeures.toLowerCase().includes('fermé') &&
          !partieHeures.toLowerCase().includes('non spécifié') &&
          partieHeures
        ) {
          const heuresMatch = partieHeures.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
          if (!heuresMatch || !this.isValidTime(heuresMatch[1]) || !this.isValidTime(heuresMatch[2])) {
            this.errorMessage = `Format d'heure invalide pour ${jour}: ${partieHeures}`;
            return false;
          }
        }
      }
    }
    return true;
  }

  saveChanges(): void {
    if (!this.tempData || !this.isFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      console.error('Formulaire invalide:', this.tempData);
      return;
    }
  
    console.log('Données à envoyer au backend:', {
      ...this.tempData,
      images: undefined,
      photoProfil: undefined,
      imagesParCategories: undefined,
      acceptReservation: this.tempData.acceptReservation,
      livraisonDisponible: this.tempData.livraisonDisponible,
      horaires: this.tempData.horaires
    });
  
    const dataToSend = {
      ...this.tempData,
      images: undefined,
      photoProfil: undefined,
      imagesParCategories: undefined,
      acceptReservation: this.tempData.acceptReservation,
      livraisonDisponible: this.tempData.livraisonDisponible,
      horaires: this.tempData.horaires
    };
  
    this.restaurantService.updateEntreprise(this.entrepriseId, dataToSend).subscribe({
      next: (updated) => {
        console.log('Données reçues du backend:', updated);
        this.restaurant = {
          ...updated,
          photoProfil: this.getProfileImage(updated.images || []),
          imagesParCategories: this.groupImagesByCategory(updated.images || []),
          acceptReservation: updated.acceptReservation,
          livraisonDisponible: updated.livraisonDisponible,
          horaires: updated.horaires
        };
        this.horairesText = this.formatHoraires(this.restaurant.horaires);
        this.closeModal();
        this.successMessage = 'Modifications enregistrées avec succès.';
        setTimeout(() => this.successMessage = null, 3000);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'Échec de la sauvegarde des modifications. Veuillez réessayer.';
        console.error('Erreur lors de la sauvegarde:', err);
      }
    });
  }
  private getProfileImage(images: Image[]): { src: string; alt: string } {
    const profileImage = images.find(img => img.categorie === 'Profil');
    return profileImage 
      ? { src: profileImage.lien, alt: 'Photo de profil' } 
      : { src: 'assets/images/default-restaurant.jpg', alt: 'Photo par défaut' };
  }

  openEditAvatarModal(): void {
    this.showAvatarModal = true;
    this.errorMessage = null;
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.resetAvatarModal();
  }

  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => this.avatarPreview = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  saveAvatarChanges(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Veuillez sélectionner une image.';
      return;
    }
  
    // Créez une URL d'aperçu temporaire
    const tempPreviewUrl = URL.createObjectURL(this.selectedFile);
  
    this.restaurantService.uploadImage(this.entrepriseId, 'Profil', this.selectedFile)
      .pipe(
        // Supprime l'ancienne image de profil si elle existe
        switchMap((newImage) => {
          const oldProfileImage = this.restaurant.images?.find(img => img.categorie === 'Profil');
          if (oldProfileImage?.id) {
            return this.restaurantService.deleteImage(oldProfileImage.id).pipe(
              // Ignore les erreurs de suppression pour continuer avec la nouvelle image
              catchError(() => of(null)),
              map(() => newImage)
            );
          }
          return of(newImage);
        })
      )
      .subscribe({
        next: (newImage) => {
          // Crée un NOUVEL objet avec une nouvelle référence
          this.restaurant = {
            ...this.restaurant,
            images: [
              ...(this.restaurant.images || []).filter(img => img.categorie !== 'Profil'),
              newImage
            ],
            photoProfil: {
              src: this.getImageUrlWithCacheBuster(newImage.lien),
              alt: 'Photo de profil mise à jour'
            }
          };
  
          this.successMessage = 'Photo mise à jour avec succès';
          setTimeout(() => this.successMessage = null, 3000);
          this.closeAvatarModal();
          
          // Libère la mémoire de l'URL d'aperçu
          URL.revokeObjectURL(tempPreviewUrl);
        },
        error: (err) => {
          this.errorMessage = 'Échec de la mise à jour. Veuillez réessayer.';
          console.error('Erreur upload:', err);
        }
      });
  }
  
  // Ajoutez cette méthode pour contourner le cache
  private getImageUrlWithCacheBuster(lien: string): string {
    const baseUrl = this.getImageUrl(lien);
    return `${baseUrl}?t=${Date.now()}`;
  }
  
  // Méthodes supplémentaires pour mieux organiser le code
  private handleUploadSuccess(newImage: Image): void {
    // Créez un nouvel objet pour forcer la détection du changement
    this.restaurant = {
      ...this.restaurant,
      images: [
        ...(this.restaurant.images || []).filter(img => img.categorie !== 'Profil'),
        newImage
      ],
      photoProfil: {
        src: this.getImageUrl(newImage.lien),
        alt: 'Nouvelle photo de profil'
      }
    };
  
    // Force la détection des changements si nécessaire
    this.cdRef.detectChanges();
  
    this.successMessage = 'Photo de profil mise à jour avec succès';
    setTimeout(() => this.successMessage = null, 3000);
    this.closeAvatarModal();
  }
  
  private handleUploadError(err: any): void {
    this.errorMessage = 'Échec de la mise à jour de la photo de profil. Veuillez réessayer.';
    console.error('Erreur lors de l\'upload:', err);
  }
  
  resetAvatarModal(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
    const fileInput = document.getElementById('avatarUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
  
  handleGalleryFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      this.galleryFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.galleryPreview = e.target?.result as string;
        this.newImageAlt = `Image ${this.selectedCategory}`;
      };
      reader.readAsDataURL(file);
    }
  }
  addListItem(listName: 'services' | 'optionsAlimentaires' | 'experiences' | 'caracteristiqueRepas' | 'accesibilite', value: string): void {
    if (!value?.trim() || !this.tempData[listName]) {
      this.errorMessage = 'Veuillez entrer une valeur valide.';
      return;
    }

    const trimmedValue = value.trim();
    if (this.tempData[listName]!.includes(trimmedValue)) {
      this.errorMessage = 'Cet élément existe déjà.';
      return;
    }

    this.restaurantService.addToList(this.entrepriseId, listName, trimmedValue).subscribe({
      next: () => {
        this.tempData[listName] = [...this.tempData[listName]!, trimmedValue];
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = `Échec de l'ajout à ${listName}. Veuillez réessayer.`;
        console.error(`Erreur ajout ${listName}:`, err);
      }
    });
  }

  removeListItem(listName: 'services' | 'optionsAlimentaires' | 'experiences' | 'caracteristiqueRepas' | 'accesibilite', value: string): void {
    if (!this.tempData[listName]) return;

    this.restaurantService.removeFromList(this.entrepriseId, listName, value).subscribe({
      next: () => {
        this.tempData[listName] = this.tempData[listName]!.filter((item: string) => item !== value);
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = `Échec de la suppression de ${listName}. Veuillez réessayer.`;
        console.error(`Erreur suppression ${listName}:`, err);
      }
    });
  }

  addImageCategory(): void {
    if (!this.newCategoryName || !this.tempData.imagesParCategories) {
      this.errorMessage = 'Veuillez entrer un nom de catégorie.';
      return;
    }

    const categoryExists = this.tempData.imagesParCategories.some(c => c.categorie === this.newCategoryName);
    if (categoryExists) {
      this.errorMessage = 'Cette catégorie existe déjà.';
      return;
    }

    this.tempData.imagesParCategories = [
      ...this.tempData.imagesParCategories,
      { categorie: this.newCategoryName, images: [] }
    ];
    this.newCategoryName = '';
    this.errorMessage = null;
  }

  removeImageCategory(category: string): void {
    if (!this.tempData.imagesParCategories) return;
    this.tempData.imagesParCategories = this.tempData.imagesParCategories.filter(c => c.categorie !== category);
  }

  removeImageFromCategory(category: string, index: number): void {
    const cat = this.tempData.imagesParCategories?.find(c => c.categorie === category);
    const imageId = cat?.images[index]?.id;
    
    if (!imageId) {
      cat?.images.splice(index, 1);
      return;
    }

    this.restaurantService.deleteImage(imageId).subscribe({
      next: () => {
        cat?.images.splice(index, 1);
        this.errorMessage = null;
      },
      error: (err) => {
        this.errorMessage = 'Échec de la suppression de l\'image. Veuillez réessayer.';
        console.error('Erreur:', err);
      }
    });
  }

  // Dans RestaurantProfileComponent
toggleReservation(): void {
  this.tempData.acceptReservation = !this.tempData.acceptReservation;
}

toggleLivraison(): void {
  this.tempData.livraisonDisponible = !this.tempData.livraisonDisponible;
}

onImageLoad() {
  // Force une détection de changement si nécessaire
  this.cdRef.detectChanges();
}




parseHorairesText(horairesText: string, currentHoraires: any = {}): any {
  const horaires: any = {};
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Initialiser avec des valeurs par défaut
  jours.forEach(jour => {
    horaires[jour] = {
      heureOuverture: '',
      heureFermeture: '',
      estFerme: false // Par défaut, non spécifié
    };
  });

  if (!horairesText) {
    console.log('Aucun texte d\'horaires fourni, retour des valeurs par défaut:', horaires);
    return horaires;
  }

  const lignes = horairesText.split('\n').map(ligne => ligne.trim()).filter(ligne => ligne);

  for (const ligne of lignes) {
    const match = ligne.match(/^(\w+)\s*:\s*(.*)$/);
    if (!match) {
      console.warn(`Ligne ignorée, format invalide: ${ligne}`);
      continue;
    }

    const jour = match[1].trim();
    const partieHeures = match[2].trim();

    if (!jours.includes(jour)) {
      console.warn(`Jour invalide ignoré: ${jour}`);
      continue;
    }

    if (partieHeures.toLowerCase().includes('fermé')) {
      horaires[jour] = {
        heureOuverture: '',
        heureFermeture: '',
        estFerme: true
      };
      console.log(`Jour ${jour} marqué comme fermé:`, horaires[jour]);
    } else if (partieHeures.toLowerCase().includes('non spécifié') || !partieHeures) {
      horaires[jour] = {
        heureOuverture: '',
        heureFermeture: '',
        estFerme: false
      };
      console.log(`Jour ${jour} marqué comme non spécifié:`, horaires[jour]);
    } else {
      const heuresMatch = partieHeures.match(/^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/);
      if (heuresMatch) {
        const heureOuverture = heuresMatch[1];
        const heureFermeture = heuresMatch[2];

        if (this.isValidTime(heureOuverture) && this.isValidTime(heureFermeture)) {
          horaires[jour] = {
            heureOuverture,
            heureFermeture,
            estFerme: false
          };
          console.log(`Jour ${jour} avec horaires:`, horaires[jour]);
        } else {
          console.warn(`Format d'heure invalide pour ${jour}: ${partieHeures}`);
        }
      } else {
        console.warn(`Format de ligne invalide pour ${jour}: ${ligne}`);
      }
    }
  }

  console.log('Horaires parsés:', horaires);
  return horaires;
}

// Méthode pour valider le format des heures (HH:mm)
private isValidTime(time: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}


onHorairesTextChange(newText: string): void {
  this.horairesText = newText;
  this.tempData.horaires = this.parseHorairesText(newText, this.tempData.horaires);
  this.cdRef.detectChanges(); // Forcer la mise à jour de l'UI
}
}