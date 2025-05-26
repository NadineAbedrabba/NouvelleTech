package com.utm.fst.project.dto;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
public class ReservationUpdateDTO {


        private LocalDate reservationDate;
        private LocalTime arrivalTime;
        private Integer nbPersonnes;
        private String preference;
        private String clientNom;
        private String clientEmail;
        private String clientTelephone;

        // getters + setters


}
