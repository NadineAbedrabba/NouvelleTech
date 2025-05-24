package com.utm.fst.project.controller;

import com.utm.fst.project.dto.ReviewDTO;
import com.utm.fst.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
    @Autowired
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
}
