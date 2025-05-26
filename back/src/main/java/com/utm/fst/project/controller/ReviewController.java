package com.utm.fst.project.controller;

import com.utm.fst.project.dto.ReviewDTO;
import com.utm.fst.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    private ReviewService reviewService;

    @PostMapping
    public ReviewDTO createReview(@RequestBody ReviewDTO dto) {
        return reviewService.createReview(dto);
    }

    @GetMapping("/entreprise/{id}")
    public List<ReviewDTO> getReviewsByEntreprise(@PathVariable Long id) {
        return reviewService.getReviewsByEntreprise(id);
    }

    @GetMapping("/client/{id}")
    public List<ReviewDTO> getReviewsByClient(@PathVariable Long id) {
        return reviewService.getReviewsByClient(id);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }

    // Total des avis
    @GetMapping("/stats/total")
    public Long getTotalReviews() {
        return reviewService.countTotalReviews();
    }

    // Moyenne générale des notes (rating global)
    @GetMapping("/stats/average-rating")
    public Double getAverageRating() {
        return reviewService.getAverageRating();
    }

    // Moyenne des notes par entreprise
    @GetMapping("/stats/average-rating-by-entreprise")
    public Map<Long, Double> getAverageRatingByEntreprise() {
        return reviewService.getAverageRatingByEntreprise();
    }

    // Distribution du nombre d’avis par note (ex: combien d’avis 1 étoile, 2 étoiles, etc.)
    @GetMapping("/stats/count-by-rating")
    public Map<Integer, Long> getCountByRating() {
        return reviewService.getCountByRating();
    }
}
