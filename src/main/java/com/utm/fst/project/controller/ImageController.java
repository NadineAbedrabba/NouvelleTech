package com.utm.fst.project.controller;

import com.utm.fst.project.entities.Image;
import com.utm.fst.project.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.utm.fst.project.entities.Entreprise;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    private final Path storagePath = Paths.get("uploads").toAbsolutePath().normalize();

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Image> createImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("categorie") String categorie,
            @RequestParam("entrepriseId") Long entrepriseId) {
        try {
            Image image = imageService.saveImage(file, categorie, entrepriseId);
            return ResponseEntity.status(HttpStatus.CREATED).body(image);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Image> getImage(@PathVariable Long id) {
        return ResponseEntity.ok(imageService.getImage(id));
    }

    @GetMapping("/entreprise/{entrepriseId}")
    public ResponseEntity<List<Image>> getImagesByEntreprise(@PathVariable Long entrepriseId) {
        return ResponseEntity.ok(imageService.getImagesByEntreprise(entrepriseId));
    }

    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Image>> getImagesByCategorie(@PathVariable String categorie) {
        return ResponseEntity.ok(imageService.getImagesByCategorie(categorie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/entreprise/{entrepriseId}/categorie/{categorie}")
    public ResponseEntity<List<Image>> getImagesByEntrepriseAndCategorie(
            @PathVariable Long entrepriseId,
            @PathVariable String categorie) {
        return ResponseEntity.ok(imageService.getImagesByEntrepriseAndCategorie(entrepriseId, categorie));
    }

    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = storagePath.resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType != null ? contentType : "application/octet-stream"))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/addLink")
    public ResponseEntity<Image> addImageByLink(
            @RequestParam("url") String url,
            @RequestParam("categorie") String categorie,
            @RequestParam("entrepriseId") Long entrepriseId) {

        Image image = new Image();
        image.setLien(url);
        image.setCategorie(categorie);

        Entreprise entreprise = new Entreprise();
        entreprise.setId(entrepriseId); // ✔️ on utilise setId hérité de User
        image.setEntreprise(entreprise);

        Image savedImage = imageService.saveImageLink(image);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedImage);
    }
}
