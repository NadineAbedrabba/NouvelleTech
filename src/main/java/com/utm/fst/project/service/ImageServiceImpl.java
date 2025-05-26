package com.utm.fst.project.service;

import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.entities.Image;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final ImageRepository imageRepository;
    private final EntrepriseRepository entrepriseRepository;

    private final Path storagePath = Paths.get("uploads").toAbsolutePath().normalize();

    @Override
    public Image saveImage(MultipartFile file, String categorie, Long entrepriseId) {
        try {
            Files.createDirectories(storagePath);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = storagePath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            Entreprise entreprise = entrepriseRepository.findById(entrepriseId)
                    .orElseThrow(() -> new RuntimeException("Entreprise not found"));

            Image image = new Image();
            image.setLien("/api/images/files/" + fileName);
            image.setCategorie(categorie);
            image.setEntreprise(entreprise); // ✅ pas de new Entreprise(id)

            return imageRepository.save(image);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }
    }

    @Override
    public Image getImage(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
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
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Image not found"));
        try {
            Path filePath = Paths.get("uploads", image.getLien().substring("/api/images/files/".length()));
            Files.deleteIfExists(filePath);
            imageRepository.deleteById(id);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image file", e);
        }
    }

    @Override
    public List<Image> getImagesByEntrepriseAndCategorie(Long entrepriseId, String categorie) {
        return imageRepository.findByEntrepriseIdAndCategorie(entrepriseId, categorie);
    }

    public Image saveImageLink(Image image) {
        return imageRepository.save(image);
    }
}
