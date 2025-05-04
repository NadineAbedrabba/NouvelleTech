package com.utm.fst.project.dto;

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
    private Long clientId;
    private Long entrepriseId;
}
