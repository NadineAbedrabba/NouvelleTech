import { Component, OnInit } from '@angular/core';
import { ItalianRestaurantCarouselComponent } from '../italian-restaurant-carousel/italian-restaurant-carousel.component';
import { RestaurantService } from '../../../../../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Restaurant } from 'src/app/models/restaurant.model';
@Component({
  selector: 'app-italian-restaurant-page',
  standalone: true,
  imports: [ItalianRestaurantCarouselComponent , CommonModule,RouterModule],
  templateUrl: './italian-restaurant-page.component.html',
  styleUrls: ['./italian-restaurant-page.component.css']  // <-- c'est "styleUrls" au pluriel
})
export class ItalianRestaurantPageComponent implements OnInit {
  topRatedRestaurants: Restaurant[] = [];
  latestRestaurants: Restaurant[] = [];
  
  constructor(private restaurantService: RestaurantService) {}
  
  ngOnInit(): void {
    this.loadItalianRestaurants();
  }
  
  loadItalianRestaurants(): void {
    this.restaurantService.getRestaurantsByCuisineTypes(['ITALIEN']).subscribe(restaurants => {
      // Filtrer uniquement les restaurants italiens acceptés
      const italians = restaurants.filter(r => r.typeCuisine === 'ITALIEN' && r.statut === 'ACCEPTEE');
  
      // Trier par rating décroissant (top rated)
      this.topRatedRestaurants = italians
        .filter(r => r.rating && r.rating > 0) // garder que ceux avec note > 0
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3); // limiter aux top 3
  

        console.log (this.topRatedRestaurants) ;
      // Trier par date de création décroissante (latest)
      this.latestRestaurants = italians
        .filter(r => r.dateDemande)
        .sort((a, b) => new Date(b.dateDemande!).getTime() - new Date(a.dateDemande!).getTime())
        .slice(0, 5); // limiter aux 5 derniers
    });
  }
}

  
