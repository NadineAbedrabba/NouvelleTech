package com.utm.fst.project.service;

import com.utm.fst.project.entities.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageService {
    Image saveImage(MultipartFile file, String categorie, Long entrepriseId);
    Image getImage(Long id);
    List<Image> getImagesByEntreprise(Long entrepriseId);
    List<Image> getImagesByCategorie(String categorie);
    void deleteImage(Long id);
    List<Image> getImagesByEntrepriseAndCategorie(Long entrepriseId, String categorie);
    Image saveImageLink(Image image);

}