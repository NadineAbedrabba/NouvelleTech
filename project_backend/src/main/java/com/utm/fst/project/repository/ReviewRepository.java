package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Entreprise;

import com.utm.fst.project.entities.Review;
import java.util.Map;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;


public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByEntrepriseId(Long entrepriseId);

    List<Review> findByClientId(Long clientId);

    // Moyenne des ratings global
    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();

    // Moyenne par entreprise : retourne List<Object[]> avec [entrepriseId, moyenne]
    @Query("SELECT r.entreprise.id, AVG(r.rating) FROM Review r GROUP BY r.entreprise.id")
    List<Object[]> findAverageRatingGroupByEntreprise();

    @Query("SELECT r.rating AS rating, COUNT(r) AS count FROM Review r GROUP BY r.rating")
    List<RatingCount> countReviewsGroupedByRating();

    interface RatingCount {
        Integer getRating();
        Long getCount();
    }

    @Query("SELECT e.rating, COUNT(e) FROM Entreprise e WHERE e.rating IS NOT NULL GROUP BY e.rating")
    List<Object[]> getCountByRating();

}
