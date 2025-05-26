import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestaurantCarouselComponent } from '../restaurant-carousel/restaurant-carousel.component';
import { RestaurantService } from '../../../../services/restaurant.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ButtonComponent } from 'src/app/shared/button.component';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-restaurant-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RestaurantCarouselComponent],
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css']
})
export class RestaurantPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Propriétés pour chaque type de cuisine
  topRatedTunisian: Restaurant[] = [];
  topRatedFastFood: Restaurant[] = [];
  topRatedHealthy: Restaurant[] = [];
  topRatedItalian: Restaurant[] = [];
  topRatedJapanese: Restaurant[] = [];
  topRatedLebanese: Restaurant[] = [];
  topRatedBuffet: Restaurant[] = [];
  topRatedCafe: Restaurant[] = [];

  // Objet pour accéder dynamiquement aux restaurants par type
  topRestaurantsByType: { [key: string]: Restaurant[] } = {};

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadTopRatedRestaurantsByType();
  }

  loadTopRatedRestaurantsByType(): void {
    const cuisineTypes = [
      'TUNISIEN', 
      'FAST_FOOD', 
      'HEALTHY',
      'ITALIEN',
      'JAPONAIS',
      'LIBANAIS',
      'BUFFET',
      'CAFE_RESTAURANT'
    ];
  
    this.restaurantService.getRestaurantsSortedByRating().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (allRestaurants) => {
        // Remplir l'objet topRestaurantsByType
        cuisineTypes.forEach(type => {
          this.topRestaurantsByType[type] = allRestaurants
            .filter(r => r.typeCuisine?.toUpperCase() === type)
            .slice(0, 3);
        });

        // Assigner aux propriétés individuelles (optionnel)
        this.topRatedTunisian = this.topRestaurantsByType['TUNISIEN'];
        this.topRatedFastFood = this.topRestaurantsByType['FAST_FOOD'];
        this.topRatedHealthy = this.topRestaurantsByType['HEALTHY'];
        this.topRatedItalian = this.topRestaurantsByType['ITALIEN'];
        this.topRatedJapanese = this.topRestaurantsByType['JAPONAIS'];
        this.topRatedLebanese = this.topRestaurantsByType['LIBANAIS'];
        this.topRatedBuffet = this.topRestaurantsByType['BUFFET'];
        this.topRatedCafe = this.topRestaurantsByType['CAFE_RESTAURANT'];
      },
      error: (err) => {
        console.error('Error loading top rated restaurants:', err);
      }
    });
  }

  // Méthode utilitaire pour accéder aux restaurants par type
  getTopRestaurantsByType(type: string): Restaurant[] {
    return this.topRestaurantsByType[type] || [];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}