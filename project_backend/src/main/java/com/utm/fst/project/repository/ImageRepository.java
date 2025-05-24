package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByEntrepriseId(Long entrepriseId);
    List<Image> findByCategorie(String categorie);
    List<Image> findByEntrepriseIdAndCategorie(Long entrepriseId, String categorie);
}