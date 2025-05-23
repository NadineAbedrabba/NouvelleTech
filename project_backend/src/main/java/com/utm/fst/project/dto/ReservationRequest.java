package com.utm.fst.project.dto;

import lombok.*;

import java.time.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {
    private LocalDate reservationDate;
    private LocalTime arrivalTime;
    private int nbPersonnes;
    private String preference;
    private String clientNom;
    private String clientEmail;
    private String clientTelephone;
    private Long companyId;
}