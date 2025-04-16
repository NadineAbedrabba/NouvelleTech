package com.utm.fst.project.dto;

import lombok.Data;

@Data
public class EntrepriseSignupDTO {
    private String name;
    private String email;
    private String password;

    // Entreprise fields
    private String nomEntreprise;
    private String secteur;
    private String adresse;
    private String telephone;
    private String specialite;
}
