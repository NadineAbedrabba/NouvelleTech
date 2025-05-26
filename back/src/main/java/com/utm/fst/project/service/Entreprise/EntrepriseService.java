package com.utm.fst.project.service.Entreprise;

import com.utm.fst.project.dto.EntrepriseDto;
import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UpdateEntrepriseUserDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import java.util.List;
import java.util.Map;

public interface EntrepriseService {
    UserDTO registerEntreprise(EntrepriseSignupDTO entrepriseSignupDTO);
    EntrepriseDto create(EntrepriseDto entrepriseDto);
    EntrepriseDto getById(Long id);
    List<EntrepriseDto> getAll();
    EntrepriseDto update(Long id, EntrepriseDto entrepriseDto);
    void delete(Long id);
    List<EntrepriseDto> getByStatut(StatutEntreprise statut);
    EntrepriseDto updateStatut(Long id, StatutEntreprise statut);
    List<EntrepriseDto> searchByNom(String nom);
    List<EntrepriseDto> getByTypeCuisine(String typeCuisine);
    List<EntrepriseDto> getByLocalisation(String localisation);

    List<EntrepriseDto> getByTypesCuisine(List<String> typesCuisine) ;
    List<EntrepriseDto> getByServices(List<String> services);
    List<EntrepriseDto> getByOptionsAlimentaires(List<String> options);
    List<EntrepriseDto> getByExperiences(List<String> experiences);
    List<EntrepriseDto> getByCaracteristiqueRepas(List<String> caracteristiques);
    List<EntrepriseDto> getByAccesibilite(List<String> accesibilites) ;
    UserDTO updateEntrepriseCredentials(Long id, UpdateEntrepriseUserDTO dto);
    List<String> getAllServicesDistincts();
    List<String> getAllOptionsAlimentairesDistincts();

    List<String> getAllAccesibiliteDistincts();
    List<String> getAllExperiencesDistincts();
    List<String> genererTagsParId(Long id);
    List<EntrepriseDto> getAllSortedByRatingDesc();
    List<EntrepriseDto> getEntreprisesAcceptedAddedLastHour();

    EntrepriseDto updateCompletStatus(Long entrepriseId, Boolean complet);
    List<EntrepriseDto> getTop5ByRating();
    Long countTotalEntreprises();
    Long countEntreprisesThisMonth();
    Long countEntreprisesLastMonth();
    List<Object[]> getMonthlyEntreprises(); // Returns e.g., List<Object[]> { { "2025-05", 10L }, ... }

    Map<StatutEntreprise, Long> getEntreprisesByStatus(); // Single declaration
    Map<String, Long> countByTypeCuisine();
    ;}