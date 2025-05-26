// review.model.ts

export interface Review {
    id: number;            // L'identifiant unique de l'avis
    rating: number;        // La note globale (rating)
    foodRating: number;    // La note de la nourriture (foodRating)
    serviceRating: number; // La note du service (serviceRating)
    ambianceRating: number; // La note de l'ambiance (ambianceRating)
    commentaire: string;   // Le commentaire
    createdAt: string;     // La date de création (format ISO string)
    clientId: number;      // L'ID du client (clientId)
    entrepriseId: number;  // L'ID de l'entreprise (entrepriseId)
      // Champs ajoutés dynamiquement
  clientName?: string;
  clientPhoto?: string;
  }
  