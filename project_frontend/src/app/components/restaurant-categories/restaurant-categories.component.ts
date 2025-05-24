import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-restaurant-categories',
  templateUrl: './restaurant-categories.component.html',
  styleUrls: ['./restaurant-categories.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RestaurantCategoriesComponent {

}
