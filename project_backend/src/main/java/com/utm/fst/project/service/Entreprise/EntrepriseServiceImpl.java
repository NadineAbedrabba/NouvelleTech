package com.utm.fst.project.service.Entreprise;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import com.utm.fst.project.dto.*;
import com.utm.fst.project.entities.*;
import com.utm.fst.project.enums.*;
import com.utm.fst.project.exception.NotFoundException;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
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
        // Créez d'abord l'entreprise
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


        // Sauvegardez d'abord l'entreprise
        Entreprise savedEntreprise = entrepriseRepository.save(entreprise);

        // Mettez à jour la référence de l'entreprise dans le User
        entreprise.setEntreprise(savedEntreprise); // Cette ligne est cruciale

        // Sauvegardez le User (entreprise) avec la référence mise à jour
        User savedUser = userRepository.save(entreprise);

        return mapToUserDTO(savedUser);
    }

    @Override
    public EntrepriseDto create(EntrepriseDto entrepriseDto) {
        Entreprise entreprise = mapToEntity(entrepriseDto);
        Entreprise saved = entrepriseRepository.save(entreprise);
        return mapToDto(saved);
    }

    @Override
    public EntrepriseDto getById(Long id) {
        Entreprise entreprise = entrepriseRepository.findWithImagesById(id)
                .orElseThrow(() -> new EntityNotFoundException("Entreprise not found"));
        return mapToDto(entreprise);
    }

    @Override
    public List<EntrepriseDto> getAll() {
        return entrepriseRepository.findAll().stream()
                .map(this::mapToDto)
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
        return mapToDto(entrepriseRepository.save(entreprise));
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
    public Long countEntreprisesThisMonth() {
        LocalDate now = LocalDate.now();
        return entrepriseRepository.countByMonth(now.getMonthValue(), now.getYear());
    }

    // ---------- MAPPING METHODS ----------

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserRole(user.getUserRole());

        return dto;
    }

    private EntrepriseDto mapToDto(Entreprise e) {
        EntrepriseDto dto = new EntrepriseDto();
        dto.setId(e.getId());
        dto.setMatricule(e.getMatricule());
        dto.setDescription(e.getDescription());
        dto.setGammePrix(e.getGammePrix());
        dto.setHoraires(e.getHoraires());
        dto.setNomEntreprise(e.getNomEntreprise());
        dto.setEmail(e.getEmail());
        dto.setAdresse(e.getAdresse());
        dto.setTelephone(e.getTelephone());
        dto.setTypeCuisine(e.getTypeCuisine());
        dto.setStatut(e.getStatut());
        dto.setDateDemande(e.getDateDemande());
        dto.setServices(e.getServices());
        dto.setExperiences(e.getExperiences());
        dto.setOptionsAlimentaires(e.getOptionsAlimentaires());
        dto.setCaracteristiqueRepas(e.getCaracteristiqueRepas());
        dto.setAccesibilite(e.getAccesibilite());
        dto.setComplet(e.isComplet());
        dto.setAcceptReservation(e.isAcceptReservation());
        dto.setLivraisonDisponible(e.isLivraisonDisponible());
        dto.setRating(e.getRating());

        if (e.getImages() != null) {
            dto.setImages(e.getImages().stream().map(image -> {
                ImageDto imageDto = new ImageDto();
                imageDto.setId(image.getId());
                imageDto.setLien(image.getLien());
                imageDto.setCategorie(image.getCategorie());
                return imageDto;
            }).collect(Collectors.toList()));
        }

        return dto;
    }

    private Entreprise mapToEntity(EntrepriseDto dto) {
        Entreprise e = new Entreprise();
        e.setMatricule(dto.getMatricule());
        e.setDescription(dto.getDescription());
        e.setGammePrix(dto.getGammePrix());
        e.setHoraires(dto.getHoraires());
        e.setNomEntreprise(dto.getNomEntreprise());
        e.setAdresse(dto.getAdresse());
        e.setTelephone(dto.getTelephone());
        e.setTypeCuisine(dto.getTypeCuisine());
        e.setStatut(dto.getStatut());
        e.setServices(dto.getServices());
        e.setRating(dto.getRating());
        e.setOptionsAlimentaires(dto.getOptionsAlimentaires());
        e.setCaracteristiqueRepas(dto.getCaracteristiqueRepas());
        e.setAccesibilite(dto.getAccesibilite());
        e.setComplet(dto.isComplet());
        e.setAcceptReservation(dto.isAcceptReservation());
        e.setLivraisonDisponible(dto.isLivraisonDisponible());
        return e;
    }

    private EntrepriseDto mapToResponse(Entreprise entreprise) {
        EntrepriseDto response = new EntrepriseDto();
        response.setId(entreprise.getId());
        response.setNomEntreprise(entreprise.getNomEntreprise());
        response.setRating(entreprise.getRating());
        response.setAdresse(entreprise.getAdresse());
        return response;
    }

    private void updateEntityFromDto(EntrepriseDto dto, Entreprise e) {
        if (dto.getNomEntreprise() != null) e.setNomEntreprise(dto.getNomEntreprise());
        if (dto.getDescription() != null) e.setDescription(dto.getDescription());
        if (dto.getEmail() != null) e.setEmail(dto.getEmail());
        if (dto.getGammePrix() != null) e.setGammePrix(dto.getGammePrix());
        if (dto.getAdresse() != null) e.setAdresse(dto.getAdresse());
        if (dto.getRating() != null) e.setRating(dto.getRating());
        if (dto.getTelephone() != null) e.setTelephone(dto.getTelephone());
        if (dto.getTypeCuisine() != null) e.setTypeCuisine(dto.getTypeCuisine());
        if (dto.getStatut() != null) e.setStatut(dto.getStatut());
        if (dto.getServices() != null) e.setServices(dto.getServices());
        if (dto.getOptionsAlimentaires() != null) e.setOptionsAlimentaires(dto.getOptionsAlimentaires());
        if (dto.getCaracteristiqueRepas() != null) e.setCaracteristiqueRepas(dto.getCaracteristiqueRepas());
        if (dto.getAccesibilite() != null) e.setAccesibilite(dto.getAccesibilite());
        if (dto.getHoraires() != null) e.setHoraires(dto.getHoraires());
        if (dto.getExperiences() != null) e.setExperiences(dto.getExperiences());
        e.setAcceptReservation(dto.isAcceptReservation());
        e.setLivraisonDisponible(dto.isLivraisonDisponible());
        e.setComplet(dto.isComplet());
    }


}
