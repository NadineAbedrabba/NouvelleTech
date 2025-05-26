export interface HoraireJournalier {
    jour: string;
    heureOuverture: string | null;
    heureFermeture: string | null;
    estFerme: boolean;
  }