package com.utm.fst.project.service.Entreprise;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;

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
    public List<EntrepriseDto> getByTypesCuisine(List<String> typesCuisine) {
        try {
            List<TypeCuisine> types = typesCuisine.stream()
                    .map(String::toUpperCase)
                    .map(TypeCuisine::valueOf)
                    .collect(Collectors.toList());

            return entrepriseRepository.findByTypeCuisineIn(types).stream()
                    .filter(e -> e.getStatut() == StatutEntreprise.ACCEPTEE)
                    .map(this::mapToDto)
                    .collect(Collectors.toList());

        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Un ou plusieurs types de cuisine sont invalides.");
        }
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
        dto.setRating(entreprise.getRating());

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

    @Override
    public List<EntrepriseDto> getByServices(List<String> services) {
        return filterByListAttribute(services, entreprise -> entreprise.getServices());
    }

    @Override
    public List<EntrepriseDto> getByOptionsAlimentaires(List<String> options) {
        return filterByListAttribute(options, entreprise -> entreprise.getOptionsAlimentaires());
    }

    @Override
    public List<EntrepriseDto> getByLocalisation(String adresse) {
        return entrepriseRepository.findByAdresseContainingIgnoreCase(adresse).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EntrepriseDto> getByExperiences(List<String> experiences) {
        return filterByListAttribute(experiences, entreprise -> entreprise.getExperiences());
    }

    @Override
    public List<EntrepriseDto> getByCaracteristiqueRepas(List<String> caracteristiques) {
        return filterByListAttribute(caracteristiques, entreprise -> entreprise.getCaracteristiqueRepas());
    }

    @Override
    public List<EntrepriseDto> getByAccesibilite(List<String> accesibilites) {
        return filterByListAttribute(accesibilites, entreprise -> entreprise.getAccesibilite());
    }

    // Méthode générique pour le filtrage
    private List<EntrepriseDto> filterByListAttribute(List<String> filterValues,
                                                      Function<Entreprise, List<String>> attributeExtractor) {

        if (filterValues == null || filterValues.isEmpty()) {
            return getAll();
        }

        return entrepriseRepository.findAll().stream()
                .filter(entreprise -> {
                    List<String> attributeValues = attributeExtractor.apply(entreprise);
                    return attributeValues != null &&
                            filterValues.stream()
                                    .anyMatch(filter -> attributeValues.contains(filter));
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private Entreprise mapToEntity(EntrepriseDto dto) {
        Entreprise entreprise = new Entreprise();
        entreprise.setMatricule(dto.getMatricule());
        entreprise.setNomEntreprise(dto.getNomEntreprise());
        entreprise.setEmail(dto.getEmail());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setTelephone(dto.getTelephone());
        entreprise.setTypeCuisine(dto.getTypeCuisine());
        entreprise.setDescription(dto.getDescription());
        entreprise.setRating(dto.getRating());
        entreprise.setStatut(dto.getStatut());
        entreprise.setComplet(dto.isComplet());
        entreprise.setAcceptReservation(dto.isAcceptReservation());
        entreprise.setLivraisonDisponible(dto.isLivraisonDisponible());
        entreprise.setGammePrix(dto.getGammePrix());
        entreprise.setHoraires(dto.getHoraires());
        entreprise.setServices(dto.getServices());
        entreprise.setOptionsAlimentaires(dto.getOptionsAlimentaires());
        entreprise.setExperiences(dto.getExperiences());
        entreprise.setCaracteristiqueRepas(dto.getCaracteristiqueRepas());
        entreprise.setAccesibilite(dto.getAccesibilite());
        entreprise.setDateDemande(dto.getDateDemande());

        // Pour les images, il faut mapper aussi (en supposant que tu as une méthode pour ça)
        // entreprise.setImages(mapImageDtosToEntities(dto.getImages()));

        return entreprise;
    }

    private void updateEntityFromDto(EntrepriseDto dto, Entreprise entreprise) {
        if (dto.getNomEntreprise() != null) {
            entreprise.setNomEntreprise(dto.getNomEntreprise());
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
        if (dto.getMatricule() != null) {
            entreprise.setMatricule(dto.getMatricule());
        }
        if (dto.getEmail() != null) {
            entreprise.setEmail(dto.getEmail());
        }
        if (dto.getDescription() != null) {
            entreprise.setDescription(dto.getDescription());
        }

        if (dto.getRating() != null) {
            entreprise.setRating(dto.getRating());
        }
        // booléens
        entreprise.setComplet(dto.isComplet());
        entreprise.setAcceptReservation(dto.isAcceptReservation());
        entreprise.setLivraisonDisponible(dto.isLivraisonDisponible());

        if (dto.getGammePrix() != null) {
            entreprise.setGammePrix(dto.getGammePrix());
        }
        if (dto.getHoraires() != null) {
            entreprise.setHoraires(dto.getHoraires());
        }
        if (dto.getServices() != null) {
            entreprise.setServices(dto.getServices());
        }
        if (dto.getOptionsAlimentaires() != null) {
            entreprise.setOptionsAlimentaires(dto.getOptionsAlimentaires());
        }
        if (dto.getExperiences() != null) {
            entreprise.setExperiences(dto.getExperiences());
        }
        if (dto.getCaracteristiqueRepas() != null) {
            entreprise.setCaracteristiqueRepas(dto.getCaracteristiqueRepas());
        }
        if (dto.getAccesibilite() != null) {
            entreprise.setAccesibilite(dto.getAccesibilite());
        }
        if (dto.getDateDemande() != null) {
            entreprise.setDateDemande(dto.getDateDemande());
        }
        // Pour les images, il faut envisager un update si tu souhaites gérer la modification d'images aussi
        // Si besoin, tu peux appeler une méthode de mapping ici
    }

    @Override
    public UserDTO updateEntrepriseCredentials(Long id, UpdateEntrepriseUserDTO dto) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entreprise not found with id: " + id));

        // Vérification de l'ancien mot de passe
        if (!passwordEncoder.matches(dto.getOldPassword(), entreprise.getPassword())) {
            throw new IllegalArgumentException("Ancien mot de passe incorrect");
        }

        // Mise à jour de l'email si fourni
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            entreprise.setEmail(dto.getEmail());
        }

        // Mise à jour du mot de passe si nouveau mot de passe fourni
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            entreprise.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        Entreprise updated = entrepriseRepository.save(entreprise);
        return mapToUserDTO(updated);
    }

    @Override
    public List<String> getAllServicesDistincts() {
        return entrepriseRepository.findDistinctServices();

    }
    @Override
    public List<String> getAllOptionsAlimentairesDistincts() {
        return entrepriseRepository.findDistinctOptionsAlimentaires();

    }

    @Override
    public List<String> getAllAccesibiliteDistincts() {
        return entrepriseRepository.findDistinctAccesibilite();

    }
    @Override
    public List<String> getAllExperiencesDistincts() {
        return entrepriseRepository.findDistinctExperiences();

    }

    @Override
    public List<String> genererTagsParId(Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise non trouvée avec l'id: " + id));

        List<String> tags = new ArrayList<>();

        if (entreprise.getServices() != null) {
            tags.addAll(entreprise.getServices());
        }

        if (entreprise.getOptionsAlimentaires() != null) {
            tags.addAll(entreprise.getOptionsAlimentaires());
        }

//        if (entreprise.getExperiences() != null) {
//            tags.addAll(entreprise.getExperiences());
//        }
//
//        if (entreprise.getCaracteristiqueRepas() != null) {
//            tags.addAll(entreprise.getCaracteristiqueRepas());
//        }
//
//        if (entreprise.getAccesibilite() != null) {
//            tags.addAll(entreprise.getAccesibilite());
//        }

        // Supprimer les doublons éventuels
        return tags.stream().distinct().collect(Collectors.toList());
    }


    @Override
    public List<EntrepriseDto> getAllSortedByRatingDesc() {
        return entrepriseRepository.findAllByOrderByRatingDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<EntrepriseDto> getEntreprisesAcceptedAddedLastHour() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(10);
        List<Entreprise> entreprises = entrepriseRepository.findByDateCreationAfterAndStatut(oneHourAgo, StatutEntreprise.ACCEPTEE);
        return entreprises.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }



    @Override
    public Long countEntreprisesThisMonth() {
        LocalDate now = LocalDate.now();
        return entrepriseRepository.countByMonth(now.getMonthValue(), now.getYear());
    }

    @Override
    public Map<StatutEntreprise, Long> getEntreprisesByStatus() {
        List<Object[]> rawData = entrepriseRepository.countGroupedByStatus();
        Map<StatutEntreprise, Long> result = new HashMap<>();
        for (Object[] obj : rawData) {
            StatutEntreprise status = (StatutEntreprise) obj[0];
            Long count = (Long) obj[1];
            if (status != null) { // Skip null status
                result.put(status, count);
            }
        }
        return result;
    }
    @Override
    public EntrepriseDto updateCompletStatus(Long id, Boolean complet) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise not found with ID: " + id));
        entreprise.setComplet(complet);
        return mapToDto(entrepriseRepository.save(entreprise));
    }

    @Override
    public List<EntrepriseDto> getTop5ByRating() {
        return entrepriseRepository.findTop5ByOrderByRatingDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private EntrepriseDto mapToResponse(Entreprise entreprise) {
        EntrepriseDto response = new EntrepriseDto();
        response.setId(entreprise.getId());
        response.setNomEntreprise(entreprise.getNomEntreprise());
        response.setRating(entreprise.getRating());
        response.setAdresse(entreprise.getAdresse());
        return response;
    }


    @Override
    public Long countTotalEntreprises() {
        return entrepriseRepository.countTotal();
    }


    @Override
    public Long countEntreprisesLastMonth() {
        LocalDate now = LocalDate.now();
        LocalDate lastMonth = now.minusMonths(1);
        return entrepriseRepository.countByMonth(lastMonth.getMonthValue(), lastMonth.getYear());
    }



    @Override
    public List<Object[]> getMonthlyEntreprises() {
        return entrepriseRepository.countGroupedByMonth();
    }

    @Override
    public Map<String, Long> countByTypeCuisine() {
        return entrepriseRepository.countByTypeCuisine().stream()
                .filter(arr -> arr[0] != null) // Ignorer les TypeCuisine null
                .collect(Collectors.toMap(
                        arr -> ((TypeCuisine) arr[0]).name().toLowerCase(),
                        arr -> (Long) arr[1]
                ));
    }






}
