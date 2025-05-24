package com.utm.fst.project.controller;
import com.utm.fst.project.service.EntrepriseListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises/{id}")
@RequiredArgsConstructor
public class EntrepriseListController {

    private final EntrepriseListService entrepriseListService;

    @PostMapping("/{listeName}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void ajouterElement(
            @PathVariable Long id,
            @PathVariable String listeName,
            @RequestBody String valeur) {
        entrepriseListService.ajouterElement(id, listeName, valeur);
    }

    @DeleteMapping("/{listeName}/{valeur}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerElement(
            @PathVariable Long id,
            @PathVariable String listeName,
            @PathVariable String valeur) {
        entrepriseListService.supprimerElement(id, listeName, valeur);
    }

    @GetMapping("/{listeName}")
    public List<String> getListe(
            @PathVariable Long id,
            @PathVariable String listeName) {
        return entrepriseListService.getListe(id, listeName);
    }
}