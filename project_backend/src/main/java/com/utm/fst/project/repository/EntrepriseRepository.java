package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import java.util.Map; // ✅
import org.springframework.data.repository.query.Param;



public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    List<Entreprise> findByStatut(StatutEntreprise statut);
    List<Entreprise> findByNomEntrepriseContainingIgnoreCase(String nom);
    List<Entreprise> findByTypeCuisine(TypeCuisine typeCuisine);
    @EntityGraph(attributePaths = {"images"})
    Optional<Entreprise> findWithImagesById(Long id);
    // Dans le repository :
    @EntityGraph(attributePaths = {"images"})
    @Query("SELECT e FROM Entreprise e JOIN FETCH e.images")
    List<Entreprise> findAllWithImages();

    @Query("SELECT COUNT(e) FROM Entreprise e")
    Long countTotal();

    @Query("SELECT COUNT(e) FROM Entreprise e WHERE FUNCTION('MONTH', e.dateDemande) = :month AND FUNCTION('YEAR', e.dateDemande) = :year")
    Long countByMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT FUNCTION('DATE_FORMAT', e.dateDemande, '%Y-%m') AS month, COUNT(e) FROM Entreprise e GROUP BY month ORDER BY month")
    List<Object[]> countGroupedByMonth();

    @Query("SELECT e.statut, COUNT(e) FROM Entreprise e GROUP BY e.statut")
    List<Object[]> countGroupedByStatus();

    // Top 5 par rating
    List<Entreprise> findTop5ByOrderByRatingDesc();

    // Nombre par type de cuisine
    @Query("SELECT e.typeCuisine, COUNT(e) FROM Entreprise e GROUP BY e.typeCuisine")
    List<Object[]> countByTypeCuisine();

    @Query(value = "SELECT MONTH(dateDemande) AS month, COUNT(*) AS count " +
            "FROM entreprise " +
            "GROUP BY month " +
            "ORDER BY month",
            nativeQuery = true)
    List<Object[]> getMonthlyEntreprises();
}