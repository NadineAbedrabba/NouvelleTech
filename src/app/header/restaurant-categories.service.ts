import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestaurantCategory } from './restaurant-category.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantCategoriesService {
  private categories: RestaurantCategory[] = [
    { id: 1, name: 'Tous les restaurants' },
    { id: 2, name: 'Francais' },
    { id: 3, name: 'Chinois' },
    { id: 4, name: 'Japonnais' },
    { id: 5, name: 'Italien' },
    { id: 6, name: 'Tunisien' },
    { id: 7, name: 'Indien' },
    { id: 8, name: 'Marocain' },
    { id: 9, name: 'Libanais' },
    { id: 10, name: 'Americain' },
    
  ];

  getCategories(): Observable<RestaurantCategory[]> {
    return of(this.categories);
  }
}