package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;
import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.enums.UserRole;
import com.utm.fst.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO registerClient(ClientSignupDTO dto) {
        Client client = new Client();
        client.setEmail(dto.getEmail());
        client.setPassword(passwordEncoder.encode(dto.getPassword()));
        client.setNom(dto.getNom());
        client.setUserRole(UserRole.CLIENT);

        Client savedClient = userRepository.save(client);
        return mapToUserDTO(savedClient);
    }

    @Override
    public ClientInfoDTO getClientInfo(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get() instanceof Client) {
            Client client = (Client) userOpt.get();
            String photoUrl = client.getImage() != null ? client.getImage().getLien() : "/assets/images/default-avatar.png";
            
            // Log pour débogage
            System.out.println("Récupération des informations du client:" + 
                    " ID=" + client.getId() + 
                    ", Nom=" + client.getNom() + 
                    ", Email=" + client.getEmail() + 
                    ", Photo URL=" + photoUrl);
            
            return new ClientInfoDTO(
                    client.getId(),
                    client.getNom(),
                    client.getEmail(),
                    photoUrl
            );
        }
        return null;
    }

    @Override
    public Long getClientIdByEmail(String email) {
        User user = userRepository.findFirstByEmail(email);
        if (user != null && user instanceof Client) {
            return user.getId();
        }
        return null;
    }
    
    @Override
    public ClientInfoDTO updateClient(Long id, ClientInfoDTO clientInfoDTO) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get() instanceof Client) {
            Client client = (Client) userOpt.get();
            
            // Mise à jour des informations du client
            if (clientInfoDTO.getNom() != null) {
                client.setNom(clientInfoDTO.getNom());
            }
            
            // Si un email est fourni et qu'il est différent de l'email actuel
            if (clientInfoDTO.getEmail() != null && !clientInfoDTO.getEmail().equals(client.getEmail())) {
                // Vérifier que l'email n'est pas déjà utilisé par un autre utilisateur
                User existingUser = userRepository.findFirstByEmail(clientInfoDTO.getEmail());
                if (existingUser != null && !existingUser.getId().equals(id)) {
                    // L'email est déjà utilisé par un autre utilisateur
                    return null;
                }
                client.setEmail(clientInfoDTO.getEmail());
            }
            
            // Logs détaillés pour comprendre le problème avec les images
            System.out.println("=== Début des logs de débogage pour les images ===");
            System.out.println("ClientInfoDTO reçu: " + clientInfoDTO);
            System.out.println("PhotoUrl dans le DTO: " + clientInfoDTO.getPhotoUrl());
            
            // Vérifier si le client a déjà une image
            if (client.getImage() != null) {
                System.out.println("Image existante: ID=" + client.getImage().getId() + ", Lien=" + client.getImage().getLien());
            } else {
                System.out.println("Le client n'a pas d'image existante");
            }
            
            // Mise à jour de l'image si fournie
            if (clientInfoDTO.getPhotoUrl() != null && !clientInfoDTO.getPhotoUrl().isEmpty() && 
                !clientInfoDTO.getPhotoUrl().equals("/assets/images/default-avatar.png")) {
                try {
                    // Si le client n'a pas encore d'image, créer une nouvelle entité Image
                    if (client.getImage() == null) {
                        System.out.println("Création d'une nouvelle image");
                        com.utm.fst.project.entities.Image image = new com.utm.fst.project.entities.Image();
                        image.setLien(clientInfoDTO.getPhotoUrl());
                        image.setCategorie("profile_" + client.getId());
                        // Sauvegarder l'image avant de l'associer au client
                        client.setImage(image);
                        System.out.println("Nouvelle image créée avec lien: " + image.getLien());
                    } else {
                        // Sinon, mettre à jour l'URL de l'image existante
                        System.out.println("Mise à jour de l'image existante");
                        client.getImage().setLien(clientInfoDTO.getPhotoUrl());
                        System.out.println("Image existante mise à jour avec lien: " + client.getImage().getLien());
                    }
                } catch (Exception e) {
                    System.err.println("Erreur lors de la mise à jour de l'image: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("Aucune image fournie, URL vide ou image par défaut");
            }
            System.out.println("=== Fin des logs de débogage pour les images ===");
            
            // Enregistrer les modifications
            Client updatedClient = userRepository.save(client);
            
            // Récupérer l'URL de la photo
            String photoUrl = updatedClient.getImage() != null ? updatedClient.getImage().getLien() : "/assets/images/default-avatar.png";
            
            // Log pour débogage
            System.out.println("Informations client mises à jour:" + 
                    " ID=" + updatedClient.getId() + 
                    ", Nom=" + updatedClient.getNom() + 
                    ", Email=" + updatedClient.getEmail() + 
                    ", Photo URL=" + photoUrl);
            
            // Retourner les informations mises à jour
            return new ClientInfoDTO(
                    updatedClient.getId(),
                    updatedClient.getNom(),
                    updatedClient.getEmail(),
                    photoUrl
            );
        }
        return null;
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserRole(user.getUserRole());
        return dto;
    }
}