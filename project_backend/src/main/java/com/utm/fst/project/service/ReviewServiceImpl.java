package com.utm.fst.project.service;

import com.utm.fst.project.dto.ReviewDTO;
import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.entities.Review;
import com.utm.fst.project.repository.ClientRepository;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.ReviewRepository;
import com.utm.fst.project.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Override
    public ReviewDTO createReview(ReviewDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        Entreprise entreprise = entrepriseRepository.findById(dto.getEntrepriseId())
                .orElseThrow(() -> new RuntimeException("Entreprise not found"));

        Review review = new Review();
        review.setRating(dto.getRating());
        review.setFoodRating(dto.getFoodRating());
        review.setServiceRating(dto.getServiceRating());
        review.setAmbianceRating(dto.getAmbianceRating());
        review.setCommentaire(dto.getCommentaire());
        review.setClient(client);
        review.setEntreprise(entreprise);

        Review saved = reviewRepository.save(review);

        dto.setId(saved.getId());
        return dto;
    }

    @Override
    public List<ReviewDTO> getReviewsByEntreprise(Long entrepriseId) {
        return reviewRepository.findByEntrepriseId(entrepriseId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewDTO> getReviewsByClient(Long clientId) {
        return reviewRepository.findByClientId(clientId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    private ReviewDTO toDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setRating(r.getRating());
        dto.setFoodRating(r.getFoodRating());
        dto.setServiceRating(r.getServiceRating());
        dto.setAmbianceRating(r.getAmbianceRating());
        dto.setCommentaire(r.getCommentaire());
        dto.setClientId(r.getClient().getId());
        dto.setEntrepriseId(r.getEntreprise().getId());
        return dto;
    }
}
