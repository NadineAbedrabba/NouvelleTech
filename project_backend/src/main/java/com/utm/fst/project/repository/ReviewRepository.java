package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Entreprise;

import com.utm.fst.project.entities.Review;
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
}
