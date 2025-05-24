package com.utm.fst.project.controller;

import com.utm.fst.project.entities.Image;
import com.utm.fst.project.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PostMapping
    public ResponseEntity<Image> createImage(@RequestBody Image image) {
        return ResponseEntity.ok(imageService.saveImage(image));
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
}