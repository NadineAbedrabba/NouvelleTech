package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;


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
}