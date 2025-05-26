import { Component, HostListener, OnInit } from '@angular/core';
import { RestaurantCategoriesService } from './restaurant-categories.service';
import { RestaurantCategory } from './restaurant-category.model';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthModule } from '../auth/auth.module';
import { AuthModalService } from '../shared/auth-modal.service';
import { UserService } from '../user-profile/user.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { SearchService } from './search.service';
import { EntrepriseDTO } from '../services/entreprise.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AuthModule, UserProfileComponent],
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
export class HeaderComponent implements OnInit {
  searchQuery: string = '';
  showSearchResults: boolean = false;
  showDropdown: boolean = false;
  restaurantCategories: RestaurantCategory[] = [];
  keepDropdownOpen = false;
  showAuthModal = false; // Propriété pour le modal d'authentification
  isUserLoggedIn = false; // Propriété pour suivre l'état de connexion
  
  // Propriétés pour la recherche
  searchResults: EntrepriseDTO[] = [];
  private searchTerms = new Subject<string>();
  isSearching = false;

  constructor(
    private categoriesService: RestaurantCategoriesService, 
    private router: Router,
    private authModalService: AuthModalService,
    public userService: UserService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadRestaurantCategories();
    
    // Vérifier l'état de connexion initial
    this.isUserLoggedIn = this.userService.isLoggedIn();
    
    // S'abonner aux changements d'état de connexion
    this.userService.currentUser$.subscribe(user => {
      console.log('État de connexion mis à jour:', user ? 'Connecté' : 'Déconnecté');
      this.isUserLoggedIn = !!user;
    });
    
    // Configurer la recherche avec debounce
    this.searchTerms.pipe(
      // Attendre 300ms après chaque frappe
      debounceTime(300),
      
      // Ignorer si le terme de recherche est le même que le précédent
      distinctUntilChanged()
    ).subscribe(term => {
      this.isSearching = true;
      this.searchService.search(term).subscribe(results => {
        this.searchResults = results;
        this.showSearchResults = results.length > 0;
        this.isSearching = false;
      });
    });
  }

  loadRestaurantCategories(): void {
    this.categoriesService.getCategories().subscribe(
      categories => this.restaurantCategories = categories,
      error => console.error('Error loading categories', error)
    );
  }

  /**
   * Méthode appelée à chaque frappe dans la barre de recherche
   */
  onSearch() {
    // Envoyer le terme de recherche au Subject
    this.searchTerms.next(this.searchQuery);
    
    // Masquer les résultats si la requête est vide
    if (!this.searchQuery.trim()) {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }
  
  /**
   * Naviguer vers la page d'un restaurant
   * @param entrepriseId L'ID de l'entreprise
   */
  goToRestaurant(entrepriseId: number) {
    this.router.navigate(['/restaurant', entrepriseId]);
    this.showSearchResults = false;
    this.searchQuery = '';
  }

  onDropdownMouseLeave(event: MouseEvent) {
    // Petit délai pour éviter la fermeture immédiate
    setTimeout(() => {
      if (!this.keepDropdownOpen) {
        this.showDropdown = false;
      }
    }, 100);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  
  // Méthodes pour gérer le modal d'authentification
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