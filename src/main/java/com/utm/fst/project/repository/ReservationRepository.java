package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Reservation;
import com.utm.fst.project.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Trouver les réservations d'une entreprise spécifique
    List<Reservation> findByEntrepriseId(Long entrepriseId);

    // Obtenir le nombre de réservations par mois pour l'année en cours
    @Query("SELECT MONTH(r.reservationDate), COUNT(r) " +
            "FROM Reservation r " +
            "WHERE YEAR(r.reservationDate) = YEAR(CURRENT_DATE) " +
            "GROUP BY MONTH(r.reservationDate)")
    List<Object[]> findMonthlyReservations();

    // Compter les réservations regroupées par statut (statut est le nom correct du champ)
    @Query("SELECT r.statut, COUNT(r) FROM Reservation r GROUP BY r.statut")
    List<Object[]> countReservationsGroupedByReservationStatus();

    // Compter les réservations entre deux dates
    Long countByReservationDateBetween(LocalDate start, LocalDate end);

    // This method counts how many reservations have the given status
    long countByStatut(String statut);
    List<Reservation> findByClientEmail(String clientEmail);

}
