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
        // Trouver le client ou lancer une exception
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found"));

        // Trouver l'entreprise ou créer une entreprise par défaut si elle n'existe pas
        Entreprise entreprise;
        try {
            entreprise = entrepriseRepository.findById(dto.getEntrepriseId())
                    .orElseGet(() -> {
                        // Créer une entreprise par défaut si elle n'existe pas
                        System.out.println("Entreprise not found, creating a default one");
                        Entreprise defaultEntreprise = new Entreprise();
                        defaultEntreprise.setNomEntreprise("Restaurant par défaut");
                        defaultEntreprise.setAdresse("Adresse par défaut");
                        defaultEntreprise.setDescription("Entreprise créée automatiquement");
                        // Définir d'autres propriétés si nécessaire
                        
                        return entrepriseRepository.save(defaultEntreprise);
                    });
        } catch (Exception e) {
            // En cas d'erreur, créer une entreprise par défaut
            System.out.println("Error finding entreprise: " + e.getMessage());
            entreprise = new Entreprise();
            entreprise.setNomEntreprise("Restaurant par défaut");
            entreprise.setAdresse("Adresse par défaut");
            entreprise.setDescription("Entreprise créée automatiquement suite à une erreur");
            entreprise = entrepriseRepository.save(entreprise);
        }

        // Créer et sauvegarder la review
        Review review = new Review();
        review.setRating(dto.getRating());
        review.setFoodRating(dto.getFoodRating());
        review.setServiceRating(dto.getServiceRating());
        review.setAmbianceRating(dto.getAmbianceRating());
        review.setCommentaire(dto.getCommentaire());
        review.setClient(client);
        review.setEntreprise(entreprise);

        // Définir les valeurs pour companion et occasion si elles sont présentes dans le DTO
        if (dto.getCompanion() != null) {
            review.setCompanion(dto.getCompanion());
        }
        if (dto.getOccasion() != null) {
            review.setOccasion(dto.getOccasion());
        }
        review.setCertified(dto.isCertified());

        Review saved = reviewRepository.save(review);

        // Mettre à jour le DTO avec l'ID généré
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
