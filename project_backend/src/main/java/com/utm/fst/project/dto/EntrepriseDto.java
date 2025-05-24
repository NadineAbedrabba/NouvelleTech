package com.utm.fst.project.dto;

import com.utm.fst.project.enums.TypeCuisine;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.entities.HoraireJournalier;
import lombok.Data;
import java.util.Map;
import java.util.List;
import java.util.Date;

@Data
public class EntrepriseDto {
    private Long id;
    private String matricule;
    private String nomEntreprise;
    private String email;
    private String adresse;
    private String telephone;
    private TypeCuisine typeCuisine;
    private String description;
    private StatutEntreprise statut;
    private boolean complet;
    private boolean acceptReservation;
    private boolean livraisonDisponible;
    private String gammePrix;
    private Map<String, HoraireJournalier> horaires;
    private List<String> services;
    private List<String> optionsAlimentaires;
    private List<String> experiences;
    private List<String> caracteristiqueRepas;
    private List<String> accesibilite;
    private Date dateDemande;
    private List<ImageDto> images; // Utilisez la classe ImageDto externe
}