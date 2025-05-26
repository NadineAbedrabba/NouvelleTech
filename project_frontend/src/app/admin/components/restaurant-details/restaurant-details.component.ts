import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RestaurantService, EntrepriseDto } from '../../../services/restaurant.service';
import { Image, HoraireJournalier } from '../../../models/restaurant.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {
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
  currentCategoryIndex = 0;
  currentImageIndex = 0;
  safeMapUrl!: SafeResourceUrl;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRestaurantDetails(id);
  }

  loadRestaurantDetails(id: number): void {
    this.isLoading = true;
    
    this.restaurantService.getRestaurantDetails(id).pipe(
      catchError(err => {
        console.error('Error loading restaurant details:', err);
        this.isLoading = false;
        return of(this.createEmptyRestaurant());
      })
    ).subscribe({
      next: (restaurantDetails) => {
        const profileImage = restaurantDetails.images?.find(img => img.categorie === 'Profil');
        this.restaurant = {
          ...restaurantDetails,
          photoProfil: profileImage 
            ? { src: this.getImageUrl(profileImage.lien), alt: 'Photo de profil' } 
            : { src: 'assets/images/default-restaurant.jpg', alt: 'Photo par défaut' },
          imagesParCategories: this.groupImagesByCategory(restaurantDetails.images || []),
          horaires: restaurantDetails.horaires || [], // Modifié pour utiliser un objet plutôt qu'un array
        };
        this.isLoading = false;
        this.setMapUrl(this.restaurant.adresse);
        this.initializeCategoryData();
        this.cdRef.detectChanges();
      }
    });
  }

  getImageUrl(lien: string): string {
    if (!lien) {
      return 'assets/images/default-restaurant.jpg';
    }
    
    if (lien.startsWith('http://') || lien.startsWith('https://')) {
      return lien;
    }
    
    if (lien.includes('review/api/images/files')) {
      const cleanPath = lien.replace(/^\/+/, '');
      return `http://localhost:8081/${cleanPath}?t=${Date.now()}`;
    }
    
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

  private createEmptyRestaurant(): EntrepriseDto {
    return {
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
      rating:1,
};
  }

  setMapUrl(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodedAddress}&output=embed&zoom=15`
    );
  }

  initializeCategoryData(): void {
    if (this.restaurant.imagesParCategories?.length > 0) {
      this.currentCategoryIndex = 0;
      this.currentImageIndex = 0;
    }
  }

  getCurrentImage(): { src: string; alt: string } {
    const currentCategory = this.restaurant?.imagesParCategories?.[this.currentCategoryIndex];
    return currentCategory?.images[this.currentImageIndex] || {
      src: 'assets/profilClient.jpg',
      alt: 'Aucune image disponible'
    };
  }

  getCurrentCategory(): string {
    const category = this.restaurant?.imagesParCategories?.[this.currentCategoryIndex];
    return category?.categorie || 'Galerie';
  }

  formatHoraires(horairesData: any): string {
    if (!horairesData || typeof horairesData !== 'object') {
      return 'Horaires non spécifiés';
    }
  
    try {
      const ordreJours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  
      const horairesArray = ordreJours
        .filter(jour => horairesData[jour])
        .map(jour => {
          const h = horairesData[jour];
          if (!h) return null;
  
          if (h.estFerme) {
            return `${jour} : Fermé`;
          }
  
          const ouverture = h.heureOuverture || '--:--';
          const fermeture = h.heureFermeture || '--:--';
          return `${jour} : ${ouverture} - ${fermeture}`;
        })
        .filter(Boolean); // enlève les valeurs null/undefined
  
      return horairesArray.length > 0 ? horairesArray.join('\n') : 'Aucun horaire renseigné';
    } catch (error) {
      console.error('Erreur de formatage des horaires:', error);
      return 'Erreur d\'affichage des horaires.';
    }
  }
  prevImage(): void {
    const images = this.restaurant.imagesParCategories[this.currentCategoryIndex]?.images || [];
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
    this.cdRef.detectChanges();
  }

  nextImage(): void {
    const images = this.restaurant.imagesParCategories[this.currentCategoryIndex]?.images || [];
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
    this.cdRef.detectChanges();
  }

  selectCategory(index: number): void {
    if (index >= 0 && index < (this.restaurant.imagesParCategories?.length || 0)) {
      this.currentCategoryIndex = index;
      this.currentImageIndex = 0;
      this.cdRef.detectChanges();
    }
  }

  handleImageError(event: Event, lien: string): void {
    console.error(`Failed to load image: ${lien}`);
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/profilClient.jpg';
    imgElement.onerror = null;
  }
}