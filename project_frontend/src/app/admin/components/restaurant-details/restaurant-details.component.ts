import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RestaurantService } from '../../../services/restaurant.service';
import { Restaurant, Image, HoraireJournalier } from '../../../models/restaurant.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.scss']
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant!: Restaurant;
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
    forkJoin({
      baseInfo: this.restaurantService.getRestaurantById(id),
      experiences: this.restaurantService.getListe(id, 'experiences'),
      services: this.restaurantService.getListe(id, 'services'),
      options: this.restaurantService.getListe(id, 'optionsAlimentaires'),
      access: this.restaurantService.getListe(id, 'accesibilite')
    }).subscribe({
      next: ({baseInfo, experiences, services, options, access}) => {
        this.restaurant = {
          ...baseInfo,
          imagesParCategories: baseInfo.imagesParCategories,
          experiences,
          services,
          optionsAlimentaires: options,
          accesibilite: access
        };
        this.isLoading = false;
        this.setMapUrl(this.restaurant.adresse);
        this.initializeCategoryData();
      },
      error: err => {
        console.error('Error loading data:', err);
        this.isLoading = false;
      }
    });
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
    this.restaurant.profileImage = this.restaurant.imagesParCategories[this.currentCategoryIndex]?.images[0] || 
      { lien: 'assets/images/default-restaurant.jpg', alt: 'Image par défaut' };
  }

  getCurrentImage(): Image {
    const currentCategory = this.restaurant?.imagesParCategories?.[this.currentCategoryIndex];
    return currentCategory?.images[this.currentImageIndex] || { lien: 'assets/images/default-restaurant.jpg' };
  }

  getCurrentCategory(): string {
    const category = this.restaurant?.imagesParCategories?.[this.currentCategoryIndex];
    return category?.categorie || 'Galerie';
  }

  formatHoraires(horaires: HoraireJournalier[]): string {
    if (!horaires || horaires.length === 0) return 'Horaires non disponibles';
    return horaires.map(h => `${h.jour}: ${h.estFerme ? 'Fermé' : `${h.heureOuverture} - ${h.heureFermeture}`}`).join('\n');
  }

  prevImage(): void {
    const images = this.restaurant.imagesParCategories[this.currentCategoryIndex]?.images || [];
    this.currentImageIndex = (this.currentImageIndex - 1 + images.length) % images.length;
  }

  nextImage(): void {
    const images = this.restaurant.imagesParCategories[this.currentCategoryIndex]?.images || [];
    this.currentImageIndex = (this.currentImageIndex + 1) % images.length;
  }

  selectCategory(index: number): void {
    if (index >= 0 && index < (this.restaurant.imagesParCategories?.length || 0)) {
      this.currentCategoryIndex = index;
      this.currentImageIndex = 0;
      this.cdRef.detectChanges();
    }
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/default-restaurant.jpg';
    imgElement.alt = 'Image non chargée';
  }
}
