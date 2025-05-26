package com.utm.fst.project.dto;

import com.utm.fst.project.enums.Companion;
import com.utm.fst.project.enums.Occasion;
import lombok.Getter;
import lombok.Setter;
import org.jetbrains.annotations.Nullable;
import java.util.Date;

@Getter
@Setter
public class ReviewDTO {

    private Long id;
    private float rating;
    private float foodRating;
    private float serviceRating;
    private float ambianceRating;
    private String commentaire;
    
    @Nullable
    private Companion companion;
    
    @Nullable
    private Occasion occasion;
    
    private Boolean certified = false; // Utilisation de Boolean (objet) au lieu de boolean (primitif) pour permettre null
    
    private Long clientId;
    private Long entrepriseId;
    private Date createdAt;
}
