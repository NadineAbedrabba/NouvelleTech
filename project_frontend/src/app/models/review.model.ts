export enum Companion {
  FAMILLE = 'FAMILLE',
  AMIS = 'AMIS',
  COUPLE = 'COUPLE',
  COLLEGUES = 'COLLEGUES',
  SEUL = 'SEUL'
}

export enum Occasion {
  DINER = 'DINER',
  DEJEUNER = 'DEJEUNER',
  AFFAIRES = 'AFFAIRES',
  CELEBRATION = 'CELEBRATION',
  AUTRE = 'AUTRE'
}

export interface ReviewDTO {
  id: number;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  commentaire: string;
  companion?: Companion;
  occasion?: Occasion;
  certified?: boolean;
  clientId: number; // Doit être un nombre valide lors de l'envoi au backend
  entrepriseId: number;
  
}

export interface Review {
  id: number;            // L'identifiant unique de l'avis
  rating: number;        // La note globale (rating)
  foodRating: number;    // La note de la nourriture (foodRating)
  serviceRating: number; // La note du service (serviceRating)
  ambianceRating: number; // La note de l'ambiance (ambianceRating)
  commentaire: string;   // Le commentaire
  createdAt?: string;     // La date de création (format ISO string)
  clientId: number;      // L'ID du client (clientId)
  entrepriseId: number;  // L'ID de l'entreprise (entrepriseId)
    // Champs ajoutés dynamiquement
clientName?: string;
clientPhoto?: string;
}
