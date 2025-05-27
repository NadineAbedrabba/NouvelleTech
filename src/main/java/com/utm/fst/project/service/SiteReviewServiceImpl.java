package com.utm.fst.project.service;

import com.utm.fst.project.dto.SiteReviewDTO;
import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.SiteReview;
import com.utm.fst.project.exception.NotFoundException;
import com.utm.fst.project.repository.ClientRepository;
import com.utm.fst.project.repository.SiteReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SiteReviewServiceImpl implements SiteReviewService {

    private final SiteReviewRepository siteReviewRepository;
    private final ClientRepository clientRepository;

    @Override
    public SiteReviewDTO createSiteReview(SiteReviewDTO siteReviewDTO) {
        // Créer l'avis
        SiteReview siteReview = new SiteReview();
        
        try {
            System.out.println("Début de la création d'un avis dans le service: " + siteReviewDTO);
            
            // Configurer l'avis
            siteReview.setRating(siteReviewDTO.getRating());
            siteReview.setCommentaire(siteReviewDTO.getCommentaire());
            
            // Définir un ID client par défaut si aucun n'est fourni
            Long clientId = siteReviewDTO.getClientId() != null ? siteReviewDTO.getClientId() : 2L;
            System.out.println("Utilisation de l'ID client: " + clientId);
            
            try {
                System.out.println("Recherche du client avec ID: " + clientId);
                Client client = clientRepository.findById(clientId).orElse(null);
                if (client != null) {
                    System.out.println("Client trouvé: " + client.getNom());
                    siteReview.setClient(client);
                } else {
                    System.out.println("Client avec ID " + clientId + " non trouvé, l'avis sera anonyme");
                }
            } catch (Exception e) {
                System.err.println("Erreur lors de la recherche du client: " + e.getMessage());
                e.printStackTrace();
                // Continuer sans client associé
            }
        } catch (Exception e) {
            System.err.println("Erreur générale lors de la préparation de l'avis: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

        System.out.println("Sauvegarde de l'avis dans la base de données");
        SiteReview saved = siteReviewRepository.save(siteReview);

        // Convertir et retourner le DTO
        return convertToDTO(saved);
    }

    @Override
    public SiteReviewDTO getSiteReview(Long id) {
        SiteReview siteReview = siteReviewRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Site review not found with id: " + id));
        return convertToDTO(siteReview);
    }

    @Override
    public List<SiteReviewDTO> getAllSiteReviews() {
        return siteReviewRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SiteReviewDTO> getRecentSiteReviews() {
        return siteReviewRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SiteReviewDTO> getTopRatedSiteReviews() {
        return siteReviewRepository.findTop10ByOrderByRatingDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SiteReviewDTO> getSiteReviewsByClient(Long clientId) {
        System.out.println("Recherche des avis pour le client ID: " + clientId);
        
        // Vérifier si le client existe
        boolean clientExists = clientRepository.existsById(clientId);
        System.out.println("Le client avec ID " + clientId + " existe: " + clientExists);
        
        // Récupérer tous les avis pour vérification
        List<SiteReview> allReviews = siteReviewRepository.findAll();
        System.out.println("Nombre total d'avis dans la base de données: " + allReviews.size());
        
        // Afficher les détails de chaque avis pour débogage
        allReviews.forEach(review -> {
            System.out.println("Avis ID: " + review.getId() + 
                             ", Rating: " + review.getRating() + 
                             ", Client: " + (review.getClient() != null ? 
                                           "ID=" + review.getClient().getId() + ", Nom=" + review.getClient().getNom() : 
                                           "null"));
        });
        
        // Récupérer les avis spécifiques au client
        List<SiteReview> clientReviews = siteReviewRepository.findByClientId(clientId);
        System.out.println("Nombre d'avis trouvés pour le client ID " + clientId + ": " + clientReviews.size());
        
        return clientReviews.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteSiteReview(Long id) {
        if (!siteReviewRepository.existsById(id)) {
            throw new NotFoundException("Site review not found with id: " + id);
        }
        siteReviewRepository.deleteById(id);
    }

    // Méthode utilitaire pour convertir une entité en DTO
    private SiteReviewDTO convertToDTO(SiteReview siteReview) {
        SiteReviewDTO dto = new SiteReviewDTO();
        dto.setId(siteReview.getId());
        dto.setRating(siteReview.getRating());
        dto.setCommentaire(siteReview.getCommentaire());
        dto.setCreatedAt(siteReview.getCreatedAt());
        // Ajouter l'ID et le nom du client si disponible
        if (siteReview.getClient() != null) {
            dto.setClientId(siteReview.getClient().getId());
            dto.setClientName(siteReview.getClient().getNom());
        } else {
            // Pour les avis anonymes
            dto.setClientName("Visiteur anonyme");
        }
        
        return dto;
    }
}
