import { Component, HostListener } from '@angular/core';
import { RestaurantCategoriesService } from './restaurant-categories.service';
import { RestaurantCategory } from './restaurant-category.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  animations: [
    trigger('dropdownAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-10px)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('void <=> *', animate('200ms ease-out'))
    ])
  ]
})
export class HeaderComponent {
  searchQuery: string = '';
  showSearchResults: boolean = false;
  showDropdown: boolean = false;
  restaurantCategories: RestaurantCategory[] = [];
  keepDropdownOpen = false;

  constructor(private categoriesService: RestaurantCategoriesService) {}

  ngOnInit(): void {
    this.loadRestaurantCategories();
  }

  loadRestaurantCategories(): void {
    this.categoriesService.getCategories().subscribe(
      categories => this.restaurantCategories = categories,
      error => console.error('Error loading categories', error)
    );
  }

  onSearch() {
    this.showSearchResults = this.searchQuery.length > 0;
  }

  onDropdownMouseLeave(event: MouseEvent) {
    const relatedTarget = event.relatedTarget as HTMLElement;
    const isMovingToDropdown = relatedTarget?.closest('.dropdown-menu');
    
    if (!isMovingToDropdown && !this.keepDropdownOpen) {
      this.showDropdown = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.dropdown-container')) {
      this.showDropdown = false;
    }
  }
}