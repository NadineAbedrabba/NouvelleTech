package com.utm.fst.project.entities;

import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.Map;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.util.Date;

@Entity
@Getter
@Setter
@DiscriminatorValue("ENTREPRISE")
public class Entreprise extends User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String matricule;

        @Column(nullable = false)
        private String nomEntreprise;

        private String adresse;
        private String telephone;

        @Enumerated(EnumType.STRING)
        @Column(name = "type_cuisine")
        private TypeCuisine typeCuisine;
        private String description;

        @Enumerated(EnumType.STRING)
        private StatutEntreprise statut = StatutEntreprise.EN_ATTENTE;

        private boolean complet;
        private boolean acceptReservation;
        private boolean livraisonDisponible;
        private String gammePrix;

        @ElementCollection
        @CollectionTable(name = "entreprise_horaires", joinColumns = @JoinColumn(name = "entreprise_id"))
        @MapKeyColumn(name = "jour_semaine")
        private Map<String, HoraireJournalier> horaires;

        @Min(0)
        @Max(5)
        private Double rating;

        // Fixing the mappings here: Remove @OneToMany, use @ElementCollection only for simple collections
        @ElementCollection
        @CollectionTable(name = "entreprise_services", joinColumns = @JoinColumn(name = "entreprise_id"))
        @Column(name = "services")
        private List<String> services;

        @ElementCollection
        @CollectionTable(name = "entreprise_optionsAlimentaires", joinColumns = @JoinColumn(name = "entreprise_id"))
        @Column(name = "optionsAlimentaires")
        private List<String> optionsAlimentaires;

        @ElementCollection
        @CollectionTable(name = "entreprise_experiences", joinColumns = @JoinColumn(name = "entreprise_id"))
        @Column(name = "experiences")
        private List<String> experiences;

        @ElementCollection
        @CollectionTable(name = "entreprise_caracteristiqueRepas", joinColumns = @JoinColumn(name = "entreprise_id"))
        @Column(name = "caracteristiqueRepas")
        private List<String> caracteristiqueRepas;

        @ElementCollection
        @CollectionTable(name = "entreprise_accesibilite", joinColumns = @JoinColumn(name = "entreprise_id"))
        @Column(name = "accesibilite")
        private List<String> accesibilite;

        @OneToMany(mappedBy = "entreprise")
        private List<User> users;

        @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Image> images;

        // Add the createdAt field
        @Temporal(TemporalType.TIMESTAMP)
        @Column(name = "created_at", nullable = false, updatable = false)
        private Date dateDemande;

        // Set the createdAt field before persisting the entity
        @PrePersist
        public void prePersist() {
                this.dateDemande = new Date();
        }
}
