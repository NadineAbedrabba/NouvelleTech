import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-restaurants-page',
  templateUrl: './restaurantsPage.component.html',
  styleUrls: ['./restaurantsPage.component.css'],
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule]
})
export class RestaurantsPageComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  cuisineTypes: string[] = [];
  priceRanges: string[] = [];
  searchQuery = '';
  selectedCuisine = 'all';
  selectedPrice = 'all';
  errorMessage: string | undefined;

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRestaurantId: number | null = null;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.restaurantService.getRestaurants().subscribe({
      next: (data) => {
        console.log('Received restaurants data:', data);
        this.restaurants = data;
        this.filteredRestaurants = [...data];
        this.extractFilterOptions();
        this.loadProfileImages();
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des restaurants:', err);
        this.errorMessage = 'Échec du chargement des restaurants.';
        this.cdRef.detectChanges();
      }
    });
  }

  extractFilterOptions(): void {
    this.cuisineTypes = [...new Set(this.restaurants.map(r => r.typeCuisine).filter(Boolean))];
    this.priceRanges = [...new Set(this.restaurants.map(r => r.gammePrix).filter(Boolean))];
  }

  filterRestaurants(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredRestaurants = this.restaurants.filter(restaurant => {
      const matchesQuery = restaurant.nomEntreprise.toLowerCase().includes(query) ||
        (restaurant.description && restaurant.description.toLowerCase().includes(query));
      const matchesCuisine = this.selectedCuisine === 'all' || restaurant.typeCuisine === this.selectedCuisine;
      const matchesPrice = this.selectedPrice === 'all' || restaurant.gammePrix === this.selectedPrice;
      return matchesQuery && matchesCuisine && matchesPrice;
    });
    this.cdRef.detectChanges();
  }

  loadProfileImages(): void {
    this.restaurants.forEach(restaurant => {
      console.log(`Loading profile image for restaurant ID: ${restaurant.id}`);
      this.restaurantService.getRestaurantDetails(restaurant.id).subscribe({
        next: (restaurantDetails) => {
          console.log(`Restaurant details for ID ${restaurant.id}:`, restaurantDetails);
          const profileImage = restaurantDetails.images?.find((img: any) => img.categorie === 'Profil');
          restaurant.profileImage = profileImage || null;
          console.log(`Set profileImage for restaurant ${restaurant.id}:`, restaurant.profileImage);
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error(`Erreur lors du chargement des détails pour le restaurant ${restaurant.id}:`, err);
          restaurant.profileImage = null;
          this.errorMessage = this.errorMessage || 'Certaines images n’ont pas pu être chargées.';
          this.cdRef.detectChanges();
        }
      });
    });
  }

  viewDetails(id: number | null): void {
    if (id === null) {
      console.warn('ID de restaurant invalide');
      return;
    }
    this.router.navigate(['EspaceAdmin/restaurants', id]);
    this.contextMenuVisible = false;
  }

  deleteRestaurant(): void {
    if (this.selectedRestaurantId !== null) {
      this.restaurantService.deleteRestaurant(this.selectedRestaurantId).subscribe({
        next: () => {
          this.restaurants = this.restaurants.filter(r => r.id !== this.selectedRestaurantId);
          this.filterRestaurants();
          this.contextMenuVisible = false;
          this.selectedRestaurantId = null;
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Erreur suppression:', err);
          this.errorMessage = 'La suppression du restaurant a échoué.';
          this.cdRef.detectChanges();
        }
      });
    }
  }

  getProfileImage(image: any): string {
    console.log('Processing restaurant profile image:', image);

    if (!image || !image.lien) {
      console.log('No image provided, returning default image: assets/profilClient.jpg');
      return 'assets/profilClient.jpg';
    }

    const lien = image.lien;

    if (lien.startsWith('http://') || lien.startsWith('https://')) {
      console.log('External URL detected:', lien);
      return lien;
    }

    if (lien.includes('review/api/images/files')) {
      const cleanPath = lien.replace(/^\/+/, '');
      console.log('Backend image with review path:', cleanPath);
      return `http://localhost:8081/${cleanPath}?t=${Date.now()}`;
    }

    const cleanPath = lien.replace(/^\/+/, '');
    const fullUrl = `http://localhost:8081/review/${cleanPath}?t=${Date.now()}`;
    console.log('Constructed backend image URL:', fullUrl);
    return fullUrl;
  }

  handleImageError(event: Event, image?: any): void {
    const imgElement = event.target as HTMLImageElement;
    console.error(`Failed to load image: ${image?.lien || 'unknown URL'}`);
    if (imgElement.src !== 'assets/profilClient.jpg') {
      console.log('Setting default image for:', image?.lien);
      imgElement.src = 'assets/profilClient.jpg';
      imgElement.onerror = null; // Prevent infinite error loop
    }
    this.cdRef.detectChanges();
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
}