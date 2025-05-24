package com.utm.fst.project.service;

import com.utm.fst.project.entities.Image;
import java.util.List;

public interface ImageService {
    Image saveImage(Image image);
    Image getImage(Long id);
    List<Image> getImagesByEntreprise(Long entrepriseId);
    List<Image> getImagesByCategorie(String categorie);
    void deleteImage(Long id);
    List<Image> getImagesByEntrepriseAndCategorie(Long entrepriseId, String categorie);
}