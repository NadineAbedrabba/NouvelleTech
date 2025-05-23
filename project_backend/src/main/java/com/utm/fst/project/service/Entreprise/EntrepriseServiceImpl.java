package com.utm.fst.project.service.Entreprise;

import com.utm.fst.project.dto.*;
import com.utm.fst.project.entities.*;
import com.utm.fst.project.enums.*;
import com.utm.fst.project.dto.ClientInfoDTO;
import com.utm.fst.project.exception.NotFoundException;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.UserRepository;
import com.utm.fst.project.service.Entreprise.EntrepriseService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException; // pour Jakarta EE

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EntrepriseServiceImpl implements EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDTO registerEntreprise(EntrepriseSignupDTO dto) {






        Entreprise entreprise = new Entreprise();
        entreprise.setEmail(dto.getEmail());
        entreprise.setMatricule(dto.getMatricule());
        entreprise.setPassword(passwordEncoder.encode(dto.getPassword()));
        entreprise.setNomEntreprise(dto.getNomEntreprise());
        entreprise.setUserRole(UserRole.ENTREPRISE);
        entreprise.setTelephone(dto.getTelephone());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setTypeCuisine(dto.getTypeCuisine());
        entreprise.setStatut(StatutEntreprise.EN_ATTENTE);

        return mapToUserDTO(userRepository.save(entreprise));




    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserRole(user.getUserRole());
        return dto;
    }
    @Override
    public EntrepriseDto create(EntrepriseDto entrepriseDto) {
        Entreprise entreprise = mapToEntity(entrepriseDto);
        Entreprise savedEntreprise = entrepriseRepository.save(entreprise);
        return mapToDto(savedEntreprise);
    }

    public EntrepriseDto getById(Long id) {
        Entreprise entreprise = entrepriseRepository.findWithImagesById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise not found"));
        return mapToDto(entreprise);
    }

    @Override
    public List<EntrepriseDto> getAll() {
        List<Entreprise> entreprises = entrepriseRepository.findAll();  // Remplacer par findAll() pour récupérer toutes les entreprises
        return entreprises.stream()
                .map(this::mapToDto)  // Utilisez mapToDto ici à la place de convertToDto
                .collect(Collectors.toList());
    }


    @Override
    public EntrepriseDto update(Long id, EntrepriseDto entrepriseDto) {
        Entreprise existing = entrepriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entreprise not found with id: " + id));

        updateEntityFromDto(entrepriseDto, existing);
        Entreprise updated = entrepriseRepository.save(existing);
        return mapToDto(updated);
    }

    @Override
    public void delete(Long id) {
        if (!entrepriseRepository.existsById(id)) {
            throw new NotFoundException("Entreprise not found with id: " + id);
        }
        entrepriseRepository.deleteById(id);
    }

    @Override
    public List<EntrepriseDto> getByStatut(StatutEntreprise statut) {
        return entrepriseRepository.findByStatut(statut).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public EntrepriseDto updateStatut(Long id, StatutEntreprise statut) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entreprise not found with id: " + id));

        entreprise.setStatut(statut);
        Entreprise updated = entrepriseRepository.save(entreprise);
        return mapToDto(updated);
    }

    @Override
    public List<EntrepriseDto> searchByNom(String nom) {
        return entrepriseRepository.findByNomEntrepriseContainingIgnoreCase(nom).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EntrepriseDto> getByTypeCuisine(String typeCuisine) {
        try {
            TypeCuisine type = TypeCuisine.valueOf(typeCuisine.toUpperCase());
            return entrepriseRepository.findByTypeCuisine(type).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Invalid cuisine type: " + typeCuisine);
        }
    }

    @Override
    public List<EntrepriseDto> getByLocalisation(String localisation) {
        return entrepriseRepository.findByLocalisationContainingIgnoreCase(localisation).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Manual mapping methods
    private EntrepriseDto mapToDto(Entreprise entreprise) {
        EntrepriseDto dto = new EntrepriseDto();
        dto.setId(entreprise.getId());
        dto.setMatricule(entreprise.getMatricule());
        dto.setDescription(entreprise.getDescription());
        dto.setGammePrix(entreprise.getGammePrix());
        dto.setHoraires(entreprise.getHoraires());
        dto.setNomEntreprise(entreprise.getNomEntreprise());
        dto.setEmail(entreprise.getEmail());
        dto.setAdresse(entreprise.getAdresse());
        dto.setTelephone(entreprise.getTelephone());
        dto.setTypeCuisine(entreprise.getTypeCuisine());
        dto.setStatut(entreprise.getStatut());
        dto.setDateDemande(entreprise.getDateDemande());

        dto.setServices(entreprise.getServices());
        dto.setExperiences(entreprise.getExperiences());
        dto.setOptionsAlimentaires(entreprise.getOptionsAlimentaires());
        dto.setCaracteristiqueRepas(entreprise.getCaracteristiqueRepas());
        dto.setAccesibilite(entreprise.getAccesibilite());
        // Mapper les images
        if(entreprise.getImages() != null) {
            dto.setImages(entreprise.getImages().stream()
                    .map(image -> {
                        ImageDto imageDto = new ImageDto(); // Utilisez la classe externe
                        imageDto.setId(image.getId());
                        imageDto.setLien(image.getLien());
                        imageDto.setCategorie(image.getCategorie());
                        return imageDto;
                    })
                    .collect(Collectors.toList()));
        }

        return dto;
    }


    private Entreprise mapToEntity(EntrepriseDto dto) {
        Entreprise entreprise = new Entreprise();
        entreprise.setMatricule(entreprise.getMatricule());
        entreprise.setDescription(entreprise.getDescription());
        entreprise.setGammePrix(entreprise.getGammePrix());
        entreprise.setHoraires(entreprise.getHoraires());
        entreprise.setNomEntreprise(dto.getNomEntreprise());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setTelephone(dto.getTelephone());
        entreprise.setTypeCuisine(dto.getTypeCuisine());
        entreprise.setStatut(dto.getStatut());
        entreprise.setServices(dto.getServices());
        return entreprise;
    }

    private void updateEntityFromDto(EntrepriseDto dto, Entreprise entreprise) {
        if (dto.getNomEntreprise() != null) {
            entreprise.setNomEntreprise(dto.getNomEntreprise());
        }

        if (dto.getDescription() != null) {
            entreprise.setDescription(dto.getDescription());
        }

        if (dto.getEmail() != null) {
            entreprise.setEmail(dto.getEmail());
        }

        if (dto.getGammePrix() != null) {
            entreprise.setGammePrix(dto.getGammePrix());
        }

        if (dto.getAdresse() != null) {
            entreprise.setAdresse(dto.getAdresse());
        }
        if (dto.getTelephone() != null) {
            entreprise.setTelephone(dto.getTelephone());
        }
        if (dto.getTypeCuisine() != null) {
            entreprise.setTypeCuisine(dto.getTypeCuisine());
        }
        if (dto.getStatut() != null) {
            entreprise.setStatut(dto.getStatut());
        }
    }


}
