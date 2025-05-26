package com.utm.fst.project.controller;

import com.utm.fst.project.entities.Image;
import com.utm.fst.project.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/images")
@RequiredArgsConstructor
public class FileUploadController {

    private final ImageService imageService;
    
    // Dossier où les images seront stockées
    private final String uploadDir = "uploads/images";
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file, 
                                         @RequestParam(value = "categorie", defaultValue = "profile") String categorie) {
        try {
            // Créer le dossier s'il n'existe pas
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Générer un nom de fichier unique
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // Chemin complet du fichier
            Path filePath = Paths.get(uploadDir, newFilename);
            
            // Enregistrer le fichier
            Files.write(filePath, file.getBytes());
            
            // Créer une entité Image
            Image image = new Image();
            image.setLien(filePath.toString().replace("\\", "/"));
            image.setCategorie(categorie);
            
            // Enregistrer l'image dans la base de données
            Image savedImage = imageService.saveImage(image);
            
            // Retourner les informations de l'image
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedImage.getId());
            response.put("lien", savedImage.getLien());
            response.put("categorie", savedImage.getCategorie());
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du téléchargement de l'image: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getImage(@PathVariable Long id) {
        try {
            Image image = imageService.getImage(id);
            if (image == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Lire le fichier
            Path filePath = Paths.get(image.getLien());
            byte[] imageBytes = Files.readAllBytes(filePath);
            
            // Déterminer le type MIME
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la récupération de l'image: " + e.getMessage());
        }
    }
}
