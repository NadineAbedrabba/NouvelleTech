package com.utm.fst.project.dto;

import com.utm.fst.project.enums.Companion;
import com.utm.fst.project.enums.Occasion;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewDTO {

    private Long id;
    private float rating;
    private float foodRating;
    private float serviceRating;
    private float ambianceRating;
    private String commentaire;
    private Companion companion;
    private Occasion occasion;
    private boolean certified;
    private Long clientId;
    private Long entrepriseId;
}
