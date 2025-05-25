import { Component, HostListener } from '@angular/core';
import { RestaurantCategoriesService } from './restaurant-categories.service';
import { RestaurantCategory } from './restaurant-category.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthModule } from '../auth/auth.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthModule],
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
  showAuthModal = false; // Ajout de la propriété manquante

  constructor(private categoriesService: RestaurantCategoriesService, private router: Router) {}

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
    // Petit délai pour éviter la fermeture immédiate
    setTimeout(() => {
      if (!this.keepDropdownOpen) {
        this.showDropdown = false;
      }
    }, 100);
  }

  // Méthode pour ouvrir le modal d'authentification
  openAuthModal() {
    this.showAuthModal = true;
  }

  // Méthode pour fermer le modal d'authentification
  closeAuthModal() {
    this.showAuthModal = false;
  }

  // Méthodes de navigation avec logs
  navigateToLogin() {
    console.log('Tentative de navigation vers la page de connexion');
    this.router.navigate(['/auth/login']).then(
      success => console.log('Navigation réussie:', success),
      error => console.error('Erreur de navigation:', error)
    );
  }
  
  navigateToRegister() {
    console.log('Tentative de navigation vers la page d\'inscription');
    this.router.navigate(['/auth/register']).then(
      success => console.log('Navigation réussie:', success),
      error => console.error('Erreur de navigation:', error)
    );
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.dropdown-container')) {
      this.showDropdown = false;
    }
  }
}