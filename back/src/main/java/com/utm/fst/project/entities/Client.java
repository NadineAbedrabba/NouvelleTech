package com.utm.fst.project.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Getter
@Setter
@Builder
@DiscriminatorValue("CLIENT")
@AllArgsConstructor
public class Client extends User {

    private String nom;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image image;

    @CreationTimestamp
    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    @JsonIgnore // éviter les boucles infinies lors du JSON
    private Entreprise entreprise;

    public Client() {
        // constructeur par défaut requis par Hibernate
    }
}