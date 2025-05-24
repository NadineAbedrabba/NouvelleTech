import { Component, AfterViewInit, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiteReviewService, SiteReviewDTO } from '../../services/site-review.service';

@Component({
  selector: 'app-review-highlight',
  templateUrl: './review-highlight.component.html',
  styleUrls: ['./review-highlight.component.scss'],
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule]
})
export class ReviewHighlightComponent implements AfterViewInit, OnInit {
  today = new Date();
  
  // Propriétés pour la fenêtre modale
  isModalOpen = false;
  userRating = 0;
  tempRating = 0;
  userReview = '';
  isLoggedIn = false; // À remplacer par la vérification réelle de l'authentification
  isReviewSubmitted = false;
  
  // ID du client connecté (simuler un client connecté pour le moment)
  clientId = 2; // ID client modifié comme demandé
  
  // Propriétés pour la moyenne des avis et le nombre total
  averageRating = 0;
  totalReviews = 0;
  
  // Propriétés pour le carrousel horizontal
  @ViewChild('reviewsSlider') reviewsSlider!: ElementRef;
  @ViewChild('reviewsTrack') reviewsTrack!: ElementRef;
  translateX = 0;
  currentSlide = 0;
  slidesCount = 0;
  slideWidth = 0;
  itemsPerSlide = 3;
  allReviews: any[] = [];
  
  constructor(private siteReviewService: SiteReviewService) {}
  
  // Couleurs pour les cartes
  cardColors = [
    'rgba(255, 107, 157, 0.1)',
    'rgba(58, 123, 213, 0.1)',
    'rgba(255, 198, 0, 0.1)'
  ];
  
  // Avis avec couleurs pré-assignées
  featuredReviews = [
    {
      name: 'Marie D.',
      location: 'Lyon',
      rating: 5,
      text: 'J\'ai trouvé LE restaurant parfait pour mon anniversaire en 2 clics ! La plateforme est tellement intuitive.',
      avatar: 'assets/Images/P1.jpg',
      color: this.cardColors[0]
    },
    {
      name: 'Pierre T.',
      location: 'Paris',
      rating: 4,
      text: 'Chaque jour une surprise différente, j\'adore cette diversité culinaire !',
      avatar: 'assets/Images/P2.jpg',
      color: this.cardColors[1]
    },
    {
      name: 'Sophie R.',
      location: 'Marseille',
      rating: 5,
      text: 'L\'expérience est ludique et les suggestions sont toujours pertinentes. 10/10 !',
      avatar: 'assets/Images/P3.jpg',
      color: this.cardColors[2]
    }
  ];

  ngOnInit(): void {
    // Charger les avis depuis le backend
    this.loadRecentReviews();
    this.loadReviewStats();
  }

  ngAfterViewInit(): void {
    this.animateCards();
  }

  getStarsArray(rating: number): any[] {
    return Array(rating).fill(0);
  }

  getRandomCardColor(): string {
    const colors = [
      'rgba(255, 107, 157, 0.1)',
      'rgba(58, 123, 213, 0.1)',
      'rgba(255, 198, 0, 0.1)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateCards() {
    const cards = document.querySelectorAll('.review-card');
    cards.forEach((card: Element) => {
      const htmlCard = card as HTMLElement;
      const delay = htmlCard.style.getPropertyValue('--delay') || '0ms';
      htmlCard.style.setProperty('--animate-duration', '0.6s');
      htmlCard.style.setProperty('--animate-delay', delay);
      htmlCard.classList.add('animate__animated', 'animate__fadeInUp');
    });
  }
  
  // Méthode pour charger les statistiques des avis
  loadReviewStats() {
    // Essayer d'abord d'utiliser l'endpoint dédié aux statistiques
    this.siteReviewService.getSiteReviewStats().subscribe({
      next: (stats) => {
        this.averageRating = stats.averageRating;
        this.totalReviews = stats.totalReviews;
        console.log('Statistiques des avis chargées:', stats);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques, calcul local utilisé:', error);
        
        // En cas d'erreur (si l'endpoint n'existe pas), charger tous les avis et calculer localement
        this.siteReviewService.getAllSiteReviews().subscribe({
          next: (reviews) => {
            const stats = this.siteReviewService.calculateAverageRating(reviews);
            this.averageRating = stats.averageRating;
            this.totalReviews = stats.totalReviews;
            console.log('Statistiques calculées localement:', stats);
          },
          error: (err) => {
            console.error('Impossible de calculer les statistiques des avis:', err);
          }
        });
      }
    });
  }

  // Méthodes pour la fenêtre modale
  openReviewModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Empêcher le défilement de la page
  }

  closeReviewModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto'; // Réactiver le défilement de la page
    
    // Réinitialiser le formulaire si l'avis n'a pas été soumis
    if (!this.isReviewSubmitted) {
      this.resetForm();
    }
  }

  setRating(rating: number) {
    this.userRating = rating;
    this.tempRating = rating;
  }

  hoverRating(rating: number) {
    this.tempRating = rating;
  }

  resetHoverRating() {
    this.tempRating = this.userRating;
  }

  isReviewValid(): boolean {
    // Simplifier la validation : vérifier seulement que l'utilisateur a donné une note et écrit un avis
    const hasRating = this.userRating > 0;
    const hasReview = this.userReview.trim().length > 0;
    return hasRating && hasReview;
  }

  submitReview() {
    // Vérifier que l'utilisateur a donné une note et écrit un avis
    if (this.userRating <= 0) {
      alert('Veuillez donner une note en cliquant sur les étoiles');
      return;
    }
    
    // Créer l'objet d'avis à envoyer au serveur
    const siteReview: SiteReviewDTO = {
      rating: this.userRating,
      commentaire: this.userReview
    };
    
    // Toujours utiliser l'ID client 2 pour le moment
    siteReview.clientId = 2;
    console.log('Utilisation de l\'ID client fixe: 2');
    
    console.log('Envoi de l\'avis au serveur:', siteReview);
    
    // Code réel pour l'appel au backend
    this.siteReviewService.createSiteReview(siteReview).subscribe({
      next: (response) => {
        console.log('Avis créé avec succès:', response);
        this.isReviewSubmitted = true;
        
        // Ajouter l'avis à la liste des avis affichés
        const newReview = {
          name: 'Vous',
          location: 'Votre ville',
          rating: this.userRating,
          text: this.userReview,
          avatar: 'assets/Images/P1.jpg',
          color: this.cardColors[Math.floor(Math.random() * this.cardColors.length)]
        };
        
        // Ajouter l'avis au début de la liste
        this.featuredReviews.unshift(newReview);
        
        // Sauvegarder dans le localStorage pour la persistence (sauvegarde locale en plus du backend)
        this.saveReviewToLocalStorage(newReview);
        
        // Fermer automatiquement la fenêtre modale après 2 secondes
        setTimeout(() => {
          this.closeReviewModal();
          // Réinitialiser le formulaire après la fermeture
          setTimeout(() => {
            this.resetForm();
            this.isReviewSubmitted = false;
          }, 300);
        }, 2000);
      },
      error: (error) => {
        console.error('Erreur lors de la création de l\'avis:', error);
        alert('Une erreur est survenue lors de l\'envoi de votre avis. Veuillez réessayer plus tard.');
        
        // En cas d'erreur, on ajoute quand même l'avis localement pour une meilleure expérience utilisateur
        const newReview = {
          name: 'Vous (non synchronisé)',
          location: 'Votre ville',
          rating: this.userRating,
          text: this.userReview,
          avatar: 'assets/Images/P1.jpg',
          color: this.cardColors[Math.floor(Math.random() * this.cardColors.length)]
        };
        
        // Ajouter l'avis au début de la liste
        this.featuredReviews.unshift(newReview);
        
        // Sauvegarder dans le localStorage
        this.saveReviewToLocalStorage(newReview);
        
        // Fermer automatiquement la fenêtre modale après 2 secondes
        setTimeout(() => {
          this.closeReviewModal();
          // Réinitialiser le formulaire après la fermeture
          setTimeout(() => {
            this.resetForm();
            this.isReviewSubmitted = false;
          }, 300);
        }, 2000);
      }
    });
    
    // Code pour la simulation locale (commenté)
    /*
    setTimeout(() => {
      console.log('Simulation de réponse réussie');
      this.isReviewSubmitted = true;
      
      // Ajouter l'avis à la liste des avis affichés
      const newReview = {
        name: 'Vous',
        location: 'Votre ville',
        rating: this.userRating,
        text: this.userReview,
        avatar: 'assets/Images/default-avatar.jpg',
        color: this.cardColors[Math.floor(Math.random() * this.cardColors.length)]
      };
      
      // Ajouter l'avis au début de la liste
      this.featuredReviews.unshift(newReview);
      
      // Sauvegarder dans le localStorage pour la persistence
      this.saveReviewToLocalStorage(newReview);
      
      // Fermer automatiquement la fenêtre modale après 2 secondes
      setTimeout(() => {
        this.closeReviewModal();
        // Réinitialiser le formulaire après la fermeture
        setTimeout(() => {
          this.resetForm();
          this.isReviewSubmitted = false;
        }, 300);
      }, 2000);
    }, 1000);
    */
  }

  resetForm() {
    this.userRating = 0;
    this.tempRating = 0;
    this.userReview = '';
  }

  // Sauvegarder l'avis dans le localStorage pour la persistence
  saveReviewToLocalStorage(review: any) {
    // Récupérer les avis existants
    const savedReviews = localStorage.getItem('userReviews');
    let reviews = [];
    
    if (savedReviews) {
      reviews = JSON.parse(savedReviews);
    }
    
    // Ajouter le nouvel avis
    reviews.push(review);
    
    // Sauvegarder dans le localStorage
    localStorage.setItem('userReviews', JSON.stringify(reviews));
  }

  // Méthode pour charger les avis récents depuis le backend
  loadRecentReviews() {
    this.siteReviewService.getRecentSiteReviews().subscribe({
      next: (reviews: SiteReviewDTO[]) => {
        console.log('Avis récents chargés:', reviews);
        
        if (reviews && reviews.length > 0) {
          // Convertir les avis du backend en format affichable
          this.allReviews = reviews.map(review => ({
            name: review.clientName || 'Visiteur anonyme',
            location: 'Client',
            rating: review.rating,
            text: review.commentaire,
            avatar: 'assets/Images/P' + (Math.floor(Math.random() * 3) + 1) + '.jpg',
            color: this.cardColors[Math.floor(Math.random() * this.cardColors.length)]
          }));
          
          console.log('Avis pour le carrousel:', this.allReviews);
          
          // Initialiser le carrousel après avoir chargé les avis
          setTimeout(() => {
            this.initCarousel();
          }, 100);
        } else {
          // Si aucun avis n'est disponible dans la base de données
          this.allReviews = [];
          console.log('Aucun avis disponible dans la base de données');
          setTimeout(() => {
            this.initCarousel();
          }, 100);
        }
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des avis récents:', error);
        // En cas d'erreur, afficher un tableau vide au lieu des avis statiques
        this.allReviews = [];
        setTimeout(() => {
          this.initCarousel();
        }, 100);
      }
    });
  }

  // Initialiser le carrousel horizontal
  initCarousel() {
    setTimeout(() => {
      if (this.reviewsSlider && this.reviewsTrack) {
        const sliderWidth = this.reviewsSlider.nativeElement.offsetWidth;
        const trackWidth = this.reviewsTrack.nativeElement.offsetWidth;
        const cards = this.reviewsTrack.nativeElement.querySelectorAll('.review-card');
        
        if (cards.length > 0) {
          this.slideWidth = sliderWidth / this.itemsPerSlide;
          this.slidesCount = Math.ceil(cards.length / this.itemsPerSlide);
          
          // Ajuster la largeur des cartes
          cards.forEach((card: HTMLElement) => {
            card.style.width = `${this.slideWidth}px`;
          });
          
          console.log(`Carrousel initialisé: ${this.slidesCount} slides, ${this.slideWidth}px par carte`);
        }
      }
    }, 0);
  }
  
  // Méthode pour aller au slide précédent
  slidePrev() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
      this.updateSlidePosition();
    }
  }
  
  // Méthode pour aller au slide suivant
  slideNext() {
    if (this.currentSlide < this.slidesCount - 1) {
      this.currentSlide++;
      this.updateSlidePosition();
    }
  }
  
  // Méthode pour aller à un slide spécifique
  goToSlide(index: number) {
    if (index >= 0 && index < this.slidesCount) {
      this.currentSlide = index;
      this.updateSlidePosition();
    }
  }
  
  // Mettre à jour la position du carrousel
  updateSlidePosition() {
    this.translateX = -this.currentSlide * (this.slideWidth * this.itemsPerSlide);
  }
  
  // Générer les indicateurs de position
  getSlideIndicators(): any[] {
    return new Array(this.slidesCount);
  }
  
  // Réinitialiser le carrousel lors du redimensionnement de la fenêtre
  @HostListener('window:resize')
  onResize() {
    this.initCarousel();
    this.updateSlidePosition();
  }
}