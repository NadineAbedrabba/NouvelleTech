package com.utm.fst.project.entities;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class HoraireJournalier {
    private String jour; // "Lundi", "Mardi", etc.
    private String heureOuverture;
    private String heureFermeture;
    private boolean estFerme; // Si le restaurant est fermé ce jour-là
}