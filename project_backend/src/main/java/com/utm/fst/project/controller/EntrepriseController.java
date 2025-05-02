package com.utm.fst.project.controller;

import com.utm.fst.project.dto.EntrepriseDto;
import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.service.Entreprise.EntrepriseService;
import com.utm.fst.project.service.user.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/entreprise")
@RequiredArgsConstructor
public class EntrepriseController {

    private final EntrepriseService entrepriseService;
    private final UserService userService;

    // 🚀 Enregistrement d'une entreprise (signup)
    @PostMapping("/register")
    public ResponseEntity<Object> register(@RequestBody EntrepriseSignupDTO dto) {
        if (userService.hasUserWithEmail(dto.getEmail())) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                    .body("L'utilisateur avec cet email existe déjà.");
        }

        UserDTO created = entrepriseService.registerEntreprise(dto);
        if (created == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Erreur lors de la création du client. Essayez plus tard.");
        }

        return ResponseEntity.ok(created);
    }

    // ➕ Créer une entreprise
    @PostMapping
    public ResponseEntity<EntrepriseDto> createEntreprise(@RequestBody EntrepriseDto dto) {
        EntrepriseDto created = entrepriseService.create(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    // 🔍 Récupérer une entreprise par ID
    @GetMapping("/{id}")
    public ResponseEntity<EntrepriseDto> getEntreprise(@PathVariable Long id) {
        return ResponseEntity.ok(entrepriseService.getById(id));
    }

    // 📄 Récupérer toutes les entreprises
    @GetMapping
    public ResponseEntity<List<EntrepriseDto>> getAllEntreprises() {
        return ResponseEntity.ok(entrepriseService.getAll());
    }

    // ✏️ Mettre à jour une entreprise
    @PutMapping("/{id}")
    public ResponseEntity<EntrepriseDto> updateEntreprise(
            @PathVariable Long id,
            @RequestBody EntrepriseDto dto) {
        return ResponseEntity.ok(entrepriseService.update(id, dto));
    }

    // ❌ Supprimer une entreprise
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntreprise(@PathVariable Long id) {
        entrepriseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 🔎 Filtrer par statut
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<EntrepriseDto>> getByStatut(@PathVariable StatutEntreprise statut) {
        return ResponseEntity.ok(entrepriseService.getByStatut(statut));
    }

    // 🛠️ Mise à jour partielle du statut
    @PatchMapping("/{id}/statut")
    public ResponseEntity<EntrepriseDto> updateStatut(
            @PathVariable Long id,
            @RequestParam StatutEntreprise statut) {
        return ResponseEntity.ok(entrepriseService.updateStatut(id, statut));
    }

    // 🔍 Recherche par nom
    @GetMapping("/search")
    public ResponseEntity<List<EntrepriseDto>> searchByNom(@RequestParam String nom) {
        return ResponseEntity.ok(entrepriseService.searchByNom(nom));
    }

    // 🔎 Filtrer par type de cuisine
    @GetMapping("/type-cuisine/{type}")
    public ResponseEntity<List<EntrepriseDto>> getByTypeCuisine(@PathVariable String type) {
        return ResponseEntity.ok(entrepriseService.getByTypeCuisine(type));
    }

    // 🔎 Filtrer par localisation
    @GetMapping("/localisation/{localisation}")
    public ResponseEntity<List<EntrepriseDto>> getByLocalisation(@PathVariable String localisation) {
        return ResponseEntity.ok(entrepriseService.getByLocalisation(localisation));
    }
}
