package com.utm.fst.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;


@Entity
@Getter
@Setter
@DiscriminatorValue("CLIENT")
public class Client extends User {

    private String nom;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image image;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

}

