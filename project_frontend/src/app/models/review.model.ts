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
  id?: number;
  rating: number;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  commentaire: string;
  companion: Companion;
  occasion: Occasion;
  certified: boolean;
  clientId: number;
  entrepriseId: number;
}
