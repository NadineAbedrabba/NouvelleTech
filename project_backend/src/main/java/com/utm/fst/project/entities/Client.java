package com.utm.fst.project.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.time.*;
import lombok.Builder;



@Entity
@Getter
@Setter
@Builder
@DiscriminatorValue("CLIENT")
public class Client extends User {

    private String nom;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;

    public Client() {
        // constructeur par défaut requis par Hibernate
    }

}

