package com.utm.fst.project.service;

import com.utm.fst.project.entities.Image;
import com.utm.fst.project.repository.ImageRepository;
import com.utm.fst.project.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;

    @Override
    public Image saveImage(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public Image getImage(Long id) {
        return imageRepository.findById(id).orElseThrow();
    }

    @Override
    public List<Image> getImagesByEntreprise(Long entrepriseId) {
        return imageRepository.findByEntrepriseId(entrepriseId);
    }

    @Override
    public List<Image> getImagesByCategorie(String categorie) {
        return imageRepository.findByCategorie(categorie);
    }

    @Override
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    @Override
    public List<Image> getImagesByEntrepriseAndCategorie(Long entrepriseId, String categorie) {
        return imageRepository.findByEntrepriseIdAndCategorie(entrepriseId, categorie);
    }
}