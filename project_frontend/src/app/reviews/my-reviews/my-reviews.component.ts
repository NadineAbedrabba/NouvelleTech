import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, ReviewDTO } from '../review.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss'],
  // Assurez-vous que les styles sont encapsulés au niveau du composant
  encapsulation: ViewEncapsulation.None
})
export class MyReviewsComponent implements OnInit {
  // Données originales et filtrées
  allReviews: ReviewDTO[] = [];
  reviews: ReviewDTO[] = [];
  isLoading = true;
  errorMessage = '';
  
  // Filtres
  searchQuery: string = '';
  ratingFilter: string = 'all';
  sortOption: string = 'date-desc';
  occasionFilter: string = 'all';
  companionFilter: string = 'all';
  
  // Options pour les filtres
  ratingOptions = [
    { value: 'all', label: 'Toutes les notes' },
    { value: '5', label: '5 étoiles' },
    { value: '4', label: '4 étoiles et plus' },
    { value: '3', label: '3 étoiles et plus' },
    { value: '2', label: '2 étoiles et plus' },
    { value: '1', label: '1 étoile et plus' }
  ];
  
  sortOptions = [
    { value: 'date-desc', label: 'Plus récents d\'abord' },
    { value: 'date-asc', label: 'Plus anciens d\'abord' },
    { value: 'rating-desc', label: 'Meilleures notes' },
    { value: 'rating-asc', label: 'Moins bonnes notes' }
  ];
  
  // Listes des occasions et compagnons uniques (seront remplies dynamiquement)
  occasionOptions: {value: string, label: string}[] = [];
  companionOptions: {value: string, label: string}[] = [];

  constructor(
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMyReviews();
  }
  
  /**
   * Initialise les options de filtres pour les occasions et compagnons
   * en fonction des valeurs uniques présentes dans les avis
   */
  initFilterOptions(): void {
    // Extraire les occasions uniques
    const occasions = new Set<string>();
    this.allReviews.forEach(review => {
      if (review.occasion) {
        occasions.add(review.occasion);
      }
    });
    
    // Créer les options pour le filtre d'occasion
    this.occasionOptions = [{ value: 'all', label: 'Toutes les occasions' }];
    occasions.forEach(occasion => {
      this.occasionOptions.push({
        value: occasion,
        label: this.getOccasionText(occasion)
      });
    });
    
    // Extraire les compagnons uniques
    const companions = new Set<string>();
    this.allReviews.forEach(review => {
      if (review.companion) {
        companions.add(review.companion);
      }
    });
    
    // Créer les options pour le filtre de compagnon
    this.companionOptions = [{ value: 'all', label: 'Tous les accompagnants' }];
    companions.forEach(companion => {
      this.companionOptions.push({
        value: companion,
        label: this.getCompanionText(companion)
      });
    });
  }
  
  /**
   * Applique les filtres et le tri aux avis
   */
  applyFilters(): void {
    console.log('Application des filtres');
    console.log('Filtre de note:', this.ratingFilter);
    console.log('Filtre d\'occasion:', this.occasionFilter);
    console.log('Filtre de compagnon:', this.companionFilter);
    console.log('Option de tri:', this.sortOption);
    console.log('Recherche:', this.searchQuery);
    
    // Commencer avec tous les avis
    let filtered = [...this.allReviews];
    
    // Filtre par recherche (nom du restaurant ou commentaire)
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(review => 
        (review.entrepriseName && review.entrepriseName.toLowerCase().includes(query)) ||
        (review.commentaire && review.commentaire.toLowerCase().includes(query))
      );
    }
    
    // Filtre par note
    if (this.ratingFilter !== 'all') {
      const minRating = parseFloat(this.ratingFilter);
      filtered = filtered.filter(review => review.rating >= minRating);
    }
    
    // Filtre par occasion
    if (this.occasionFilter !== 'all') {
      filtered = filtered.filter(review => review.occasion === this.occasionFilter);
    }
    
    // Filtre par compagnon
    if (this.companionFilter !== 'all') {
      filtered = filtered.filter(review => review.companion === this.companionFilter);
    }
    
    // Tri des avis
    filtered.sort((a, b) => {
      switch (this.sortOption) {
        case 'date-asc':
          return this.compareDates(a.createdAt, b.createdAt);
        case 'date-desc':
          return this.compareDates(b.createdAt, a.createdAt);
        case 'rating-asc':
          return a.rating - b.rating;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return this.compareDates(b.createdAt, a.createdAt); // Par défaut, du plus récent au plus ancien
      }
    });
    
    // Mettre à jour les avis filtrés
    this.reviews = filtered;
    console.log('Nombre d\'avis après filtrage:', this.reviews.length);
  }
  
  /**
   * Compare deux dates pour le tri, en gérant les valeurs null ou undefined
   */
  private compareDates(dateA?: Date | null, dateB?: Date | null): number {
    // Si les deux dates sont nulles ou undefined, elles sont considérées comme égales
    if (!dateA && !dateB) return 0;
    // Si seule la première date est nulle, elle est considérée comme inférieure
    if (!dateA) return -1;
    // Si seule la deuxième date est nulle, elle est considérée comme inférieure
    if (!dateB) return 1;
    
    // Convertir en objets Date si ce sont des chaînes
    const dateObjA = typeof dateA === 'string' ? new Date(dateA) : dateA;
    const dateObjB = typeof dateB === 'string' ? new Date(dateB) : dateB;
    
    // Comparer les timestamps
    return dateObjA.getTime() - dateObjB.getTime();
  }
  
  /**
   * Réinitialise tous les filtres
   */
  resetFilters(): void {
    this.searchQuery = '';
    this.ratingFilter = 'all';
    this.sortOption = 'date-desc';
    this.occasionFilter = 'all';
    this.companionFilter = 'all';
    this.applyFilters();
  }

  loadMyReviews(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Vérifier si l'ID client est disponible dans le localStorage
    const clientId = localStorage.getItem('clientId');
    console.log('ID client récupéré du localStorage dans MyReviewsComponent:', clientId);
    
    if (!clientId) {
      console.error('Aucun ID client trouvé dans le localStorage');
      this.errorMessage = 'Vous devez être connecté pour voir vos avis. Veuillez vous connecter et réessayer.';
      this.isLoading = false;
      return;
    }

    try {
      console.log('Tentative de récupération des avis pour le client ID:', clientId);
      this.reviewService.getMyReviews()
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (reviews) => {
            console.log('Avis récupérés avec succès:', reviews);
            
            // Vérifier les dates dans les avis reçus
            reviews.forEach((review, index) => {
              console.log(`Avis #${index + 1} - ID: ${review.id}, Date: ${review.createdAt}`);
              if (review.createdAt) {
                console.log(`Type de la date: ${typeof review.createdAt}`);
                // Si la date est une chaîne, la convertir en objet Date
                if (typeof review.createdAt === 'string') {
                  review.createdAt = new Date(review.createdAt);
                  console.log(`Date convertie: ${review.createdAt}`);
                }
              } else {
                console.warn(`Avis #${index + 1} - Pas de date de création`);
              }
            });
            
            // Stocker tous les avis originaux
            this.allReviews = reviews;
            
            // Initialiser les options de filtres
            this.initFilterOptions();
            
            // Appliquer les filtres initiaux
            this.applyFilters();
            
            if (reviews.length === 0) {
              console.log('Aucun avis trouvé pour ce client');
            }
          },
          error: (error) => {
            console.error('Erreur lors de la récupération des avis:', error);
            
            // Vérifier le type d'erreur pour afficher un message plus précis
            if (error.message && error.message.includes('Client ID not found')) {
              this.errorMessage = 'Vous devez être connecté pour voir vos avis. Veuillez vous connecter et réessayer.';
            } else if (error.status === 401 || error.status === 403) {
              this.errorMessage = 'Vous n\'avez pas les droits nécessaires pour accéder à ces avis. Veuillez vous reconnecter.';
            } else {
              this.errorMessage = 'Impossible de récupérer vos avis. Veuillez réessayer plus tard.';
            }
          }
        });
    } catch (error) {
      console.error('Exception lors de la récupération des avis:', error);
      this.errorMessage = 'Impossible de récupérer vos avis. Veuillez vous connecter pour voir vos avis.';
      this.isLoading = false;
    }
  }

  deleteReview(reviewId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      this.reviewService.deleteReview(reviewId)
        .subscribe({
          next: () => {
            this.reviews = this.reviews.filter(review => review.id !== reviewId);
            console.log('Avis supprimé avec succès');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'avis:', error);
            alert('Impossible de supprimer l\'avis. Veuillez réessayer plus tard.');
          }
        });
    }
  }

  // Méthode pour formater la date
  formatDate(date: Date | undefined): string {
    console.log('Date reçue:', date);
    if (!date) {
      console.warn('Date non définie pour l\'avis');
      return 'Date inconnue';
    }
    
    try {
      // Convertir en objet Date si c'est une chaîne
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      console.log('Date convertie:', dateObj);
      
      // Vérifier si la date est valide
      if (isNaN(dateObj.getTime())) {
        console.error('Date invalide:', date);
        return 'Date invalide';
      }
      
      return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Erreur de date';
    }
  }

  // Méthode pour naviguer vers la page du restaurant
  goToRestaurant(entrepriseId: number): void {
    this.router.navigate(['/restaurant', entrepriseId]);
  }

  // Méthode pour obtenir la couleur de la note
  getRatingColor(rating: number): string {
    if (rating >= 4) return 'green';
    if (rating >= 3) return 'orange';
    return 'red';
  }

  // Méthode pour obtenir le texte de l'occasion
  getOccasionText(occasion: string): string {
    switch (occasion) {
      case 'BUSINESS': return 'Affaires';
      case 'FAMILY': return 'Famille';
      case 'COUPLE': return 'En couple';
      case 'FRIENDS': return 'Entre amis';
      case 'SOLO': return 'Seul(e)';
      default: return occasion;
    }
  }

  // Méthode pour obtenir le texte du compagnon
  getCompanionText(companion: string): string {
    switch (companion) {
      case 'FAMILY': return 'Famille';
      case 'COUPLE': return 'En couple';
      case 'FRIENDS': return 'Entre amis';
      case 'SOLO': return 'Seul(e)';
      case 'BUSINESS': return 'Collègues';
      default: return companion;
    }
  }
}
