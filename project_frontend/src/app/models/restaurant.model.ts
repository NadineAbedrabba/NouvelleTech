export interface Image {
  lien: string;
  categorie?: string;
}

export interface HoraireJournalier {
  jour: string;
  heureOuverture: string;
  heureFermeture: string;
  estFerme: boolean;
}

export interface Restaurant {
  id: number;
  nomEntreprise: string;
  matricule: string;
  adresse: string;
  horaires: HoraireJournalier[];
  telephone: string;
  email: string;
  description: string;
  typeCuisine: string;
  gammePrix: string;
  livraisonDisponible: boolean;
  acceptReservation: boolean;
  rating: number;
  services: string[];
  optionsAlimentaires: string[];
  experiences: string[];
  accesibilite: string[];
  imagesParCategories: {
    categorie: string;
    images: Image[];
  }[];
  images: Image[];
  profileImage?: Image;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'NON_ACCEPTEE';
  dateDemande?: Date;
}