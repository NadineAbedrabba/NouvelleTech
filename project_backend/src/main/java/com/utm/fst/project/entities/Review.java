package com.utm.fst.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Entity
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private float rating;

    @Column(nullable = false)
    private float foodRating;

    @Column(nullable = false)
    private float serviceRating;

    @Column(nullable = false)
    private float ambianceRating;

    @Column(length = 2000)
    private String commentaire;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "entreprise_id", nullable = false)
    private Entreprise entreprise;

    @PrePersist
    public void prePersist() {
        this.createdAt = new Date();
    }
}
