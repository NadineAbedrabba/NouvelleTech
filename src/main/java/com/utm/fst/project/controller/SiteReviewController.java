package com.utm.fst.project.controller;

import com.utm.fst.project.dto.SiteReviewDTO;
import com.utm.fst.project.service.SiteReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/site-reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SiteReviewController {

    private final SiteReviewService siteReviewService;

    @PostMapping
    public ResponseEntity<SiteReviewDTO> createSiteReview(@RequestBody SiteReviewDTO siteReviewDTO) {
        try {
            System.out.println("Reçu une demande de création d'avis: " + siteReviewDTO);
            SiteReviewDTO createdReview = siteReviewService.createSiteReview(siteReviewDTO);
            System.out.println("Avis créé avec succès: " + createdReview);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'avis: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<SiteReviewDTO> getSiteReview(@PathVariable Long id) {
        return ResponseEntity.ok(siteReviewService.getSiteReview(id));
    }

    @GetMapping
    public ResponseEntity<List<SiteReviewDTO>> getAllSiteReviews() {
        return ResponseEntity.ok(siteReviewService.getAllSiteReviews());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SiteReviewDTO>> getRecentSiteReviews() {
        return ResponseEntity.ok(siteReviewService.getRecentSiteReviews());
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<SiteReviewDTO>> getTopRatedSiteReviews() {
        return ResponseEntity.ok(siteReviewService.getTopRatedSiteReviews());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<SiteReviewDTO>> getSiteReviewsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(siteReviewService.getSiteReviewsByClient(clientId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSiteReview(@PathVariable Long id) {
        siteReviewService.deleteSiteReview(id);
        return ResponseEntity.noContent().build();
    }
}
