package com.utm.fst.project.dto;

import com.utm.fst.project.enums.ReservationStatus;
import lombok.*;

import java.time.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private Long id;
    private LocalDateTime createdAt;
    private LocalDate reservationDate;
    private LocalTime arrivalTime;
    private int nbPersonnes;
    private String preference;
    private ReservationStatus statut;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;
    private Long companyId;
    private String companyName;
}