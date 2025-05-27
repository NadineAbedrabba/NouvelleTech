import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { PriceRangeComponent } from '../price-range/price-range.component';
import { DisponibilityComponent } from '../disponibility/disponibility.component';
import { LeafletMapComponent } from '../leaflet-map/leaflet-map.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-restaurants-page',
  standalone: true,
  imports: [CommonModule, PriceRangeComponent, DisponibilityComponent, LeafletMapComponent , FormsModule],
  templateUrl: './restaurants-page.component.html',
  styleUrls: ['./restaurants-page.component.css']
})
export class RestaurantsPageComponent implements OnInit, OnDestroy {
  private static VALID_TYPES = [
    'TUNISIEN',
    'FAST_FOOD',
    'HEALTHY',
    'ITALIEN',
   'JAPONAIS',
    'LIBANAIS',
    'BUFFET',
    'CAFE_RESTAURANT',
  ];

  showOptions = false;
  showFilters = false;

  restaurants: Restaurant[] = [];
  services: string[] = [];
  optionsAlimentaires: string[] = [];
  accesibilites: string[] = [];
  experiences: string[] = [];
  private allRestaurants: Restaurant[] = [];


  selectedTypes: string[] = [];
  selectedServices: string[] = [];
  selectedExperiences: string[] = [];
  selectedAccesibilites: string[] = [];
  
  loading = true;
  error: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private restaurantService: RestaurantService , private route: ActivatedRoute,private router: Router) {}


  searchTerm: string = '';
  searchSortOrder: 'asc' | 'desc' = 'asc'; // Nouvelle propriété pour l'ordre de tri

  private searchSubject = new Subject<string>();
  cuisineType: string | null = null;

  ngOnInit() {

    
    this.addClickListeners();
    this.checkScreenSize();
    this.loadRestaurants();
    this.loadAllLists();

this.route.params.subscribe(params => {
      this.cuisineType = params['id'] ;
      console.log('CuisineType:', this.cuisineType);
      if (this.cuisineType) {
        this.selectedTypes = [];

        this.selectedTypes.push( this.cuisineType);
        this.fetchFilteredRestaurants();

       }
    })
    ;
    
    
    this.searchSubject.pipe(
      debounceTime(10),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyAllFilters();
    });
    
  }
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }


goToDetails(id: number) {
  this.router.navigate(['/detailsRestaurant', id.toString()]);
}

goToReserve(id: number) {
      this.router.navigate(['/reserver'], { queryParams: { id } });

}
  
  toggleSearchSortOrder(): void {
    this.searchSortOrder = this.searchSortOrder === 'asc' ? 'desc' : 'asc';
    this.applyAllFilters();
  }
  // Charge les restaurants et leurs tags
  loadRestaurants() {
    this.restaurantService.getRestaurants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.allRestaurants = data;  // liste complète
          this.restaurants = [...data]; // copie pour affichage / filtres
          this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
          this.loading = false;
        },
        error: err => {
          console.error('Erreur lors du chargement des restaurants:', err);
          this.error = 'Une erreur est survenue lors du chargement des restaurants.';
          this.loading = false;
        }
      });
  }
  

  // Charge services, options alimentaires, accessibilités et expériences en parallèle
  loadAllLists() {

    forkJoin({
      services: this.restaurantService.getServices(),
      options: this.restaurantService.getOptionsAlimentaires(),
      accesibilites: this.restaurantService.getAccesibilite(),
      experiences: this.restaurantService.getExperiences()
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ services, options, accesibilites, experiences }) => {
          this.services = services;
          this.optionsAlimentaires = options;
          this.accesibilites = accesibilites;
          this.experiences = experiences;
        },
        error: err => {
          console.error('Erreur lors de la récupération des listes:', err);
          // Eventuellement afficher un message d'erreur ici
        }
      });
  }

  trierParNote() {
    this.loading = true;
    this.restaurantService.getRestaurantsSortedByRating()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.restaurants = data;
  
          // Recharge les tags pour chaque restaurant trié
          this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
  
          this.loading = false;
        },
        error: err => {
          console.error('Erreur lors du tri par note:', err);
          this.error = 'Erreur lors du tri par note.';
          this.loading = false;
        }
      });
  }
  trierDerniersAjouts() {
    this.loading = true;
    this.error = null;
    this.restaurantService.getEntreprisesAddedLastHour()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          this.restaurants = data;

          // Recharge les tags pour chaque entreprise triée
          this.restaurants.forEach(r => this.loadTagsForRestaurant(r));

          this.loading = false;
        },
        error: err => {
          console.error('Erreur lors du tri par derniers ajouts:', err);
          this.error = 'Erreur lors du tri par derniers ajouts.';
          this.loading = false;
        }
      });
  }
  loadTagsForRestaurant(restaurant: Restaurant) {
    this.restaurantService.getTags(restaurant.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: tags => restaurant.tags = tags,
        error: err => {
          console.error(`Erreur chargement tags pour restaurant ${restaurant.id}`, err);
          restaurant.tags = [];
        }
      });
  }

  onServiceCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const service = checkbox.value;
  
    if (checkbox.checked) {
      if (!this.selectedServices.includes(service)) {
        this.selectedServices.push(service);
      }
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
  
    this.applyServiceFilter();
  }

  applyServiceFilter(): void {
    if (this.selectedServices.length === 0) {
      this.restaurants = [...this.allRestaurants];
    } else {
      this.restaurants = this.allRestaurants.filter(restaurant =>
        restaurant.services.some(service => this.selectedServices.includes(service))
      );
    }
  }

  isServiceSelected(service: string): boolean {
    return this.selectedServices.includes(service);
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.showFilters = window.innerWidth > 730;
  }

  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  toggleFilters() {
    if (window.innerWidth <= 730) {
      this.showFilters = !this.showFilters;
    }
  }

  get iconName(): string {
    return this.showOptions ? 'arrow_drop_up' : 'arrow_drop_down';
  }

  get iconNameFilters(): string {
    return this.showFilters ? 'arrow_drop_up' : 'arrow_drop_down';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }



  
  private addClickListeners(): void {
    const paragraphs = document.querySelectorAll('.sort > p') as NodeListOf<HTMLParagraphElement>;
  
    paragraphs.forEach((p: HTMLParagraphElement) => {
      p.addEventListener('click', () => {
        // On enlève la classe selected de tous sauf celui cliqué
        paragraphs.forEach(otherP => {
          if (otherP !== p) {
            otherP.classList.remove('selected');
          }
        });
  
        // Puis on toggle la classe selected sur celui cliqué
        p.classList.toggle('selected');
  
        if (p.classList.contains('selected')) {
          console.log(`${p.textContent} est sélectionné`);
        } else {
          console.log(`${p.textContent} n'est plus sélectionné`);
        }
      });
    });
  }
  toggleTypeSelection(type: string): void {
    // Nettoyage : suppression espaces + majuscules
    const normalizedType = type.trim().toUpperCase();
  
    if (!RestaurantsPageComponent.VALID_TYPES.includes(normalizedType)) {
      console.warn(`Type "${type}" non valide, ignoré.`);
      return; // Ne rien faire si le type n'est pas reconnu
    }
  
    const index = this.selectedTypes.findIndex(
      t => t.toUpperCase() === normalizedType
    );
  
    if (index === -1) {
      this.selectedTypes.push(normalizedType);
    } else {
      this.selectedTypes.splice(index, 1);
    }
  
    this.fetchFilteredRestaurants();
  }
  
  isSelected(type: string): boolean {
    const normalizedType = type.trim().toUpperCase();
    return this.selectedTypes.some(t => t.toUpperCase() === normalizedType);
  }
  
  fetchFilteredRestaurants(): void {
    if (this.selectedTypes.length === 0) {
      this.loadRestaurants(); // recharge tous les restos et leurs tags
      return;
    }
  
    this.restaurantService.getRestaurantsByCuisineTypes(this.selectedTypes)
      .subscribe(restos => {
        this.restaurants = restos;
        // Charger les tags pour chaque restaurant filtré
        this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
      });
  }
  
  onExperienceCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const experience = checkbox.value;
  
    if (checkbox.checked) {
      if (!this.selectedExperiences.includes(experience)) {
        this.selectedExperiences.push(experience);
      }
    } else {
      this.selectedExperiences = this.selectedExperiences.filter(e => e !== experience);
    }
  
    this.applyAllFilters();
  }
  
  onAccesibiliteCheckboxChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const acc = checkbox.value;
  
    if (checkbox.checked) {
      if (!this.selectedAccesibilites.includes(acc)) {
        this.selectedAccesibilites.push(acc);
      }
    } else {
      this.selectedAccesibilites = this.selectedAccesibilites.filter(a => a !== acc);
    }
  
    this.applyAllFilters();
  }
  applyAllFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.restaurants = this.allRestaurants.filter(restaurant => {
       // Filtre principal sur le nom (obligatoire)
    if (term !== '' && !restaurant.nomEntreprise.toLowerCase().includes(term)) {
      return false;
    }
  

      // Filtre sur services
      const servicesMatch = this.selectedServices.length === 0 
        || restaurant.services.some(s => this.selectedServices.includes(s));
  
      // Filtre sur types
      const typesMatch = this.selectedTypes.length === 0
        || this.selectedTypes.includes(restaurant.typeCuisine.toUpperCase());
  
      // Filtre sur expériences
      const experienceMatch = this.selectedExperiences.length === 0
        || restaurant.experiences.some(e => this.selectedExperiences.includes(e));
  
      // Filtre sur accessibilités
      const accesibiliteMatch = this.selectedAccesibilites.length === 0
        || restaurant.accesibilite.some(a => this.selectedAccesibilites.includes(a));
  
      // Filtre sur options alimentaires
      const optionsMatch = this.selectedOptionsAlimentaires.length === 0
        || (restaurant.optionsAlimentaires && restaurant.optionsAlimentaires.some(o => this.selectedOptionsAlimentaires.includes(o)));
  
      // Filtre sur prix
      const priceMatch = this.selectedMinPrice == null || this.selectedMaxPrice == null 
        || this.checkPriceMatch(restaurant);
  
      // Filtre sur rating - MODIFIEZ CE BLOC
    const ratingMatch = this.selectedRating === null 
    || (restaurant.rating && Math.floor(restaurant.rating) === this.selectedRating);
    // Notez le === au lieu de >= pour une correspondance exacte

  return servicesMatch && typesMatch && experienceMatch && 
         accesibiliteMatch && optionsMatch && priceMatch && ratingMatch;
});


// Tri par nom si nécessaire
if (this.searchTerm) {
  this.sortRestaurantsByName();
}

    // Recharge les tags pour chaque restaurant filtré
    this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
  }
  
  // Ajoutez cette méthode pour trier les restaurants par nom
private sortRestaurantsByName(): void {
  this.restaurants.sort((a, b) => {
    const nameA = a.nomEntreprise.toLowerCase();
    const nameB = b.nomEntreprise.toLowerCase();
    
    if (this.searchSortOrder === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });


}



  // Ajoutez cette méthode helper pour le filtre de prix
  private checkPriceMatch(restaurant: Restaurant): boolean {
    if (!restaurant.gammePrix) return false;
    
    const [minStr, maxStr] = restaurant.gammePrix.split('-');
    const minPriceRestaurant = Number(minStr);
    const maxPriceRestaurant = Number(maxStr);
  
    if (isNaN(minPriceRestaurant) || isNaN(maxPriceRestaurant)) return false;
  
    return !(maxPriceRestaurant < this.selectedMinPrice! || minPriceRestaurant > this.selectedMaxPrice!);
  }
  resetExperiences(): void {
    this.selectedExperiences = [];
    this.applyAllFilters();
  }
  
  resetAccesibilites(): void {
    this.selectedAccesibilites = [];
    this.applyAllFilters();
  }

  
  resetServices(): void {
    this.selectedServices = [];
    this.applyAllFilters();
  }

  resetTypes(): void {
    this.selectedTypes = [];
    this.applyAllFilters();
  }


  resetNote(): void {
    this.selectedRating = null;
    this.applyAllFilters();
  }

  
  selectedOptionsAlimentaires: string[] = [];

  toggleOptionsAlimentairesSelection(option: string): void {
    // Vérifie si l'option est bien dans la liste des options possibles
    if (!this.optionsAlimentaires.includes(option)) {
      console.warn(`Option "${option}" non valide, ignorée.`);
      return;
    }
  
    const index = this.selectedOptionsAlimentaires.indexOf(option);
  
    if (index === -1) {
      this.selectedOptionsAlimentaires.push(option);
    } else {
      this.selectedOptionsAlimentaires.splice(index, 1);
    }
  
    this.fetchFilteredRestaurantsByOptions();
  }
  
  fetchFilteredRestaurantsByOptions(): void {
    if (this.selectedOptionsAlimentaires.length === 0) {
      this.restaurants = [...this.allRestaurants];
    } else {
      this.restaurants = this.allRestaurants.filter(restaurant =>
        restaurant.optionsAlimentaires?.some(option =>
          this.selectedOptionsAlimentaires.includes(option)
        )
      );
    }
  
    // Recharge les tags pour chaque restaurant filtré
    this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
  }
  
  
  isSelectedOptionsAlimentaires(option: string): boolean {
    return this.selectedOptionsAlimentaires.includes(option);
  }


  selectedMinPrice!: number ;
  selectedMaxPrice!: number ;
  
  onPriceRangeChanged(range: [number, number]): void {
    this.selectedMinPrice = range[0];
    this.selectedMaxPrice = range[1];
    console.log("Prix min:", this.selectedMinPrice, "Prix max:", this.selectedMaxPrice);
  
    // Tu peux maintenant appliquer un filtre ici
    this.filtrerRestaurantsParPrix();
  }
  
  filtrerRestaurantsParPrix(): void {
    // On commence avec les restaurants déjà filtrés par les autres critères
    let filteredRestaurants = [...this.restaurants]; 
    
    if (this.selectedMinPrice == null || this.selectedMaxPrice == null) {
      // Si pas de filtre de prix défini, on garde les restaurants déjà filtrés
      this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
      return;
    }
  
    filteredRestaurants = filteredRestaurants.filter(restaurant => {
      if (!restaurant.gammePrix) return false; // Pas de prix, on exclut
  
      // Parse la fourchette de prix du restaurant, par ex "5-10"
      const [minStr, maxStr] = restaurant.gammePrix.split('-');
  
      const minPriceRestaurant = Number(minStr);
      const maxPriceRestaurant = Number(maxStr);
  
      // Si parsing invalide, exclure
      if (isNaN(minPriceRestaurant) || isNaN(maxPriceRestaurant)) return false;
  
      // Vérifie si les deux intervalles se chevauchent :
      // Interval restaurant : [minPriceRestaurant, maxPriceRestaurant]
      // Interval sélectionné : [selectedMinPrice, selectedMaxPrice]
      const overlap = !(maxPriceRestaurant < this.selectedMinPrice || minPriceRestaurant > this.selectedMaxPrice);
  
      return overlap;
    });
  
    this.restaurants = filteredRestaurants;
    this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
  }
  
  // Ajoutez cette propriété à votre classe
selectedRating: number | null = null;

// Ajoutez cette méthode pour gérer le clic sur une étoile
onStarClick(rating: number): void {
  // Si on clique sur la même étoile, on désélectionne
  this.selectedRating = this.selectedRating === rating ? null : rating;
  this.applyAllFilters(); // Utilisez applyAllFilters au lieu de applyRatingFilter
}

// Ajoutez cette méthode pour filtrer par rating
applyRatingFilter(): void {
  if (this.selectedRating === null) {
    this.restaurants = [...this.allRestaurants];
  } else {
    this.restaurants = this.allRestaurants.filter(restaurant => 
      Math.floor(restaurant.rating) >= this.selectedRating!
    );
  }
  // Recharge les tags pour chaque restaurant filtré
  this.restaurants.forEach(r => this.loadTagsForRestaurant(r));
}

// Ajoutez cette méthode pour vérifier si une étoile est sélectionnée
isStarSelected(rating: number): boolean {
  return this.selectedRating !== null && rating <= this.selectedRating;
}


onSearchKeyUp(): void {
  this.applyAllFilters();
}


resetAll(): void {
  // Réinitialiser les filtres sélectionnés
  this.selectedTypes = [];
  this.selectedServices = [];
  this.selectedExperiences = [];
  this.selectedAccesibilites = [];
  this.selectedOptionsAlimentaires = [];

  // Réinitialiser les filtres spécifiques (prix, rating, recherche)
  this.selectedMinPrice = 0;
  this.selectedMaxPrice = 200;
  this.selectedRating = null;
  this.searchTerm = '';
  this.searchSortOrder = 'asc';

  // Recharge la liste complète des restaurants (et leurs tags)
  this.loadRestaurants();
}

}
