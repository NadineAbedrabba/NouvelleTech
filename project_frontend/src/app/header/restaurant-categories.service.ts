import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RestaurantCategory } from './restaurant-category.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantCategoriesService {
  private categories: RestaurantCategory[] = [
    { id: 1, name: 'Tous les restaurants' },
    { id: 2, name: 'Tunisien' },
    { id: 3, name: 'Restau Bar' },
    { id: 4, name: 'Asiatique' },
    { id: 5, name: 'Italien' },
    { id: 6, name: 'Buffet' },
    { id: 7, name: 'Healthy' }
    
  ];

  getCategories(): Observable<RestaurantCategory[]> {
    return of(this.categories);
  }
}