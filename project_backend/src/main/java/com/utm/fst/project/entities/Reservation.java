package com.utm.fst.project.entities;

import jakarta.persistence.*;
import lombok.*;
import com.utm.fst.project.enums.ReservationStatus;
import java.time.*;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDate reservationDate;

    @Column(nullable = false)
    private LocalTime arrivalTime;

    private int nbPersonnes;
    private String preference;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ReservationStatus statut = ReservationStatus.EN_ATTENTE;

    private String clientNom;
    private String clientEmail;
    private String clientTelephone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entreprise_id", nullable = false)
    private Entreprise entreprise;
}