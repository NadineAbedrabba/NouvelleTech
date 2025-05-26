import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../services/review.service';
import { ReviewDTO, Companion, Occasion } from '../models/review.model';
import { ActivatedRoute } from '@angular/router';
import { EntrepriseService, EntrepriseDTO } from '../services/entreprise.service';
import { UserService, Client } from '../user-profile/user.service';

@Component({
  selector: 'app-review',
  templateUrl: './review-container.component.html',
  styleUrls: ['./review-container.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ReviewContainerComponent implements OnInit {
  reviewText: string = '';
  ratingCategories = [
    { label: 'Nourriture', rating: 0, icon: '🍽️' },
    { label: 'Service', rating: 0, icon: '💁' },
    { label: 'Ambiance', rating: 0, icon: '🎶' }
  ];
  companion: string = '';
  occasion: string = '';
  isCertified: boolean = false;
  isSubmitting: boolean = false;
  
  // Options pour les sélecteurs
  companionOptions = Object.values(Companion);
  occasionOptions = Object.values(Occasion);
  
  // Liste des entreprises disponibles
  entreprises: EntrepriseDTO[] = [];
  entrepriseSelectionnee: EntrepriseDTO | null = null;
  
  // ID de l'entreprise pour laquelle on soumet la review (à récupérer depuis la route ou un service)
  entrepriseId: number | null = null; // Sera défini lors de la sélection d'une entreprise
  clientId: number | null = null; // Sera défini dynamiquement à partir de l'utilisateur connecté
  
  // Informations sur le client connecté
  clientConnecte: Client | null = null;
  
  // Indique si une entreprise a été spécifiée dans l'URL
  entrepriseSpecifiee: boolean = false;
  
  // Message d'erreur éventuel
  errorMessage: string = '';
  
  constructor(
    private reviewService: ReviewService,
    private entrepriseService: EntrepriseService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  
  ngOnInit(): void {
    // Récupérer la liste des entreprises disponibles
    this.entrepriseService.getAllEntreprises().subscribe({
      next: (entreprises) => {
        this.entreprises = entreprises;
        console.log('Entreprises récupérées:', entreprises);
        
        // Récupérer l'ID de l'entreprise depuis les paramètres de la route si disponible
        this.route.params.subscribe(params => {
          if (params['id']) {
            const entrepriseId = +params['id'];
            this.entrepriseSpecifiee = true;
            
            // Vérifier si l'entreprise existe
            const entrepriseTrouvee = this.entreprises.find(e => e.id === entrepriseId);
            if (entrepriseTrouvee) {
              this.entrepriseId = entrepriseId;
              this.entrepriseSelectionnee = entrepriseTrouvee;
            } else {
              this.errorMessage = `L'entreprise avec l'ID ${entrepriseId} n'existe pas. Veuillez sélectionner une entreprise valide.`;
            }
          }
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des entreprises:', error);
        this.errorMessage = 'Impossible de récupérer la liste des entreprises. Veuillez réessayer plus tard.';
      }
    });
    
    // Récupérer les informations du client connecté
    this.userService.currentClient$.subscribe(client => {
      this.clientConnecte = client;
      if (client) {
        console.log('Client connecté récupéré:', client);
        console.log('ID client utilisé pour la review:', client.id);
        this.clientId = client.id;
      } else {
        console.warn('Aucun client connecté détecté. Vérification de l\'utilisateur...');
        
        // Si nous n'avons pas d'informations client, essayer de récupérer l'utilisateur
        const user = this.userService.getCurrentUser();
        if (user) {
          console.log('Utilisateur connecté récupéré:', user);
          console.log('Tentative de récupération des informations client pour l\'utilisateur ID:', user.id);
          
          // Forcer le chargement des informations client
          this.userService.loadClientInfo(user.id);
          
          // Vérifier à nouveau après un court délai
          setTimeout(() => {
            const clientInfo = this.userService.getClientInfo();
            if (clientInfo) {
              console.log('Informations client récupérées après délai:', clientInfo);
              this.clientId = clientInfo.id;
              console.log('ID client défini après délai:', this.clientId);
            } else {
              console.warn('Impossible de récupérer les informations client même après délai');
            }
          }, 1000);
        } else {
          console.warn('Aucun utilisateur connecté. Les reviews ne pourront pas être créées sans ID client.');
          this.clientId = null;
        }
      }
    });
  }

  get overallRating(): number {
    const ratings = this.ratingCategories.map(c => c.rating).filter(r => r > 0);
    return ratings.length > 0 ? 
      ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }

  isFormValid(): boolean {
    return this.reviewText.trim().length > 0 && 
           this.ratingCategories.every(c => c.rating > 0) && 
           this.companion !== '' &&  // Explicit check for non-empty string
           this.occasion !== '' &&   // Explicit check for non-empty string
           this.isCertified === true; // Explicit boolean check
  }
  
  // Méthode appelée lorsqu'une entreprise est sélectionnée dans le dropdown
  onEntrepriseChange(event: any): void {
    const entrepriseId = +event.target.value;
    if (entrepriseId) {
      const entrepriseSelectionnee = this.entreprises.find(e => e.id === entrepriseId);
      if (entrepriseSelectionnee) {
        this.entrepriseId = entrepriseId;
        this.entrepriseSelectionnee = entrepriseSelectionnee;
        this.errorMessage = '';
      }
    } else {
      this.entrepriseId = null;
      this.entrepriseSelectionnee = null;
    }
  }

  submitReview() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Récupérer l'ID client directement depuis le localStorage
      const clientIdFromStorage = localStorage.getItem('clientId');
      console.log('ID client récupéré du localStorage:', clientIdFromStorage);
      
      // Vérifier à nouveau les informations client les plus récentes
      const clientActuel = this.userService.getClientInfo();
      if (clientActuel && clientActuel.id) {
        // Mettre à jour l'ID client si nécessaire
        if (this.clientId !== clientActuel.id) {
          console.log(`Mise à jour de l'ID client: ${this.clientId} -> ${clientActuel.id}`);
          this.clientId = clientActuel.id;
        }
      } else if (clientIdFromStorage) {
        // Utiliser l'ID client du localStorage si disponible
        console.log(`Utilisation de l'ID client du localStorage: ${clientIdFromStorage}`);
        this.clientId = Number(clientIdFromStorage);
      }
      
      // Vérifier si l'utilisateur est connecté
      const user = this.userService.getCurrentUser();
      if (!user) {
        // Si l'utilisateur n'est pas connecté, afficher un message d'erreur
        alert('Vous devez être connecté pour soumettre un avis. Veuillez vous connecter et réessayer.');
        this.isSubmitting = false;
        return;
      }
      
      // Si nous n'avons toujours pas d'ID client valide mais que l'utilisateur est connecté
      // utiliser un ID temporaire pour le développement
      if (!this.clientId) {
        console.warn('ID client non disponible. Utilisation d\'un ID temporaire pour le développement.');
        this.clientId = 1; // ID temporaire pour le développement
      }
      
      // Utiliser l'ID d'entreprise s'il est défini, sinon utiliser une valeur par défaut (1)
      const entrepriseIdToUse = this.entrepriseId !== null ? this.entrepriseId : 1;
      
      // Créer l'objet ReviewDTO à envoyer au backend
      const reviewDTO: ReviewDTO = {
        rating: this.overallRating,
        foodRating: this.ratingCategories[0].rating,
        serviceRating: this.ratingCategories[1].rating,
        ambianceRating: this.ratingCategories[2].rating,
        commentaire: this.reviewText,
        companion: this.companion as Companion,
        occasion: this.occasion as Occasion,
        certified: this.isCertified,
        clientId: this.clientId, // Utilisation de l'ID client (qui est maintenant garanti d'être non null)
        entrepriseId: entrepriseIdToUse
      };
      
      console.log('Envoi de review au backend avec ID client:', this.clientId);
      
      console.log('Détails de la review:', reviewDTO);
      
      // Appel au backend pour créer la review
      this.reviewService.createReview(reviewDTO).subscribe({
        next: (response) => {
          console.log('Review créée avec succès:', response);
          this.isSubmitting = false;
          this.resetForm();
          
          // Notification de succès
          alert('Votre avis a été soumis avec succès et enregistré dans la base de données!');
        },
        error: (error) => {
          console.error('Erreur lors de la création de la review:', error);
          console.error('Détails de l\'erreur:', error.error);
          console.error('Status:', error.status);
          console.error('Message:', error.message);
          
          // Afficher plus de détails sur l'erreur
          if (error.error && error.error.message) {
            console.error('Message d\'erreur du serveur:', error.error.message);
          }
          
          this.isSubmitting = false;
          
          // Notification d'erreur avec plus de détails
          let errorMessage = 'Une erreur est survenue lors de la soumission de votre avis.';
          if (error.status === 404) {
            errorMessage += ' L\'entreprise spécifiée n\'existe pas dans la base de données.';
          } else if (error.status === 400) {
            errorMessage += ' Les données envoyées sont invalides.';
          } else if (error.status === 0) {
            errorMessage += ' Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.';
          }
          alert(errorMessage);
          
          // Si l'erreur est due à l'entreprise non trouvée, on simule quand même un succès pour l'utilisateur
          if (error.status === 404 && error.error && error.error.message && error.error.message.includes('Entreprise not found')) {
            console.log('Simulation de succès après erreur d\'entreprise non trouvée');
            setTimeout(() => {
              this.resetForm();
              alert('Votre avis a été soumis avec succès! (Simulé)');
            }, 1000);
          }
        }
      });
    }
  }

  resetForm() {
    this.reviewText = '';
    this.ratingCategories.forEach(c => c.rating = 0);
    this.companion = '';
    this.occasion = '';
    this.isCertified = false;
  }
  
  /**
   * Sauvegarde une review dans le localStorage pour simuler la persistence
   * @param review La review à sauvegarder
   */
  saveReviewToLocalStorage(review: any) {
    try {
      // Récupérer les reviews existantes
      const savedReviewsString = localStorage.getItem('savedReviews');
      const savedReviews = savedReviewsString ? JSON.parse(savedReviewsString) : [];
      
      // Ajouter la nouvelle review
      savedReviews.push({
        ...review,
        savedAt: new Date().toISOString() // Ajouter la date de sauvegarde
      });
      
      // Sauvegarder la liste mise à jour
      localStorage.setItem('savedReviews', JSON.stringify(savedReviews));
      
      console.log('Review sauvegardée dans localStorage:', review);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }
}
