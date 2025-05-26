package com.utm.fst.project.service.Entreprise;

import com.utm.fst.project.dto.EntrepriseDto;
import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.enums.StatutEntreprise;
import com.utm.fst.project.enums.TypeCuisine;
import java.util.List;

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
   // List<EntrepriseDto> getByLocalisation(String localisation);
    
    /**
     * Compte le nombre d'entreprises par type de cuisine
     * @return Une map contenant le nombre d'entreprises pour chaque type de cuisine
     */
    java.util.Map<String, Long> countByTypeCuisine();
}