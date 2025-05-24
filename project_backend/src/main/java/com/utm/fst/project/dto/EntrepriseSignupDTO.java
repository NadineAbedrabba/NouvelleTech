package com.utm.fst.project.dto;

import com.utm.fst.project.enums.TypeCuisine;
import lombok.Data;
import java.util.Date;


@Data
public class EntrepriseSignupDTO {
    private String email;
    private String matricule;
    private String password;
    private String nomEntreprise;
    private String description;
    private String adresse;
    private String telephone;
    private TypeCuisine typeCuisine;
    private String localisation;
    // Add the createdAt field in DTO as well
    private Date createdAt;
}
