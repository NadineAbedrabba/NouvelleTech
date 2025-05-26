package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNom(String nom);
    // Compte total des clients
    @Query("SELECT COUNT(c) FROM Client c")
    Long countTotalClients();
    // Compte les clients créés ce mois-ci
    @Query("SELECT COUNT(c) FROM Client c WHERE YEAR(c.dateCreation) = YEAR(CURRENT_DATE) " +
            "AND MONTH(c.dateCreation) = MONTH(CURRENT_DATE)")
    Long countClientsThisMonth();

    // Compte les clients créés le mois dernier
    @Query("SELECT COUNT(c) FROM Client c WHERE c.dateCreation >= :startOfLastMonth AND c.dateCreation < :startOfThisMonth")
    Long countClientsLastMonth(@Param("startOfLastMonth") LocalDateTime startOfLastMonth,
                               @Param("startOfThisMonth") LocalDateTime startOfThisMonth);

    // Clients par mois (version native, compatible MySQL)
    @Query(value = "SELECT DATE_FORMAT(date_creation, '%Y-%m') AS month, COUNT(*) AS client_count " +
            "FROM Client " +
            "GROUP BY month " +
            "ORDER BY month",
            nativeQuery = true)
    List<Object[]> getMonthlyClients();
}