package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Settings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {
    
    /**
     * Trouve tous les paramètres pour un client spécifique
     * @param clientId ID du client
     * @return Liste des paramètres du client
     */
    List<Settings> findByClientId(Long clientId);
    
    /**
     * Trouve un paramètre spécifique pour un client
     * @param clientId ID du client
     * @param settingType Type de paramètre (ex: "preferences", "privacy")
     * @return Le paramètre s'il existe
     */
    Optional<Settings> findByClientIdAndSettingType(Long clientId, String settingType);
    
    /**
     * Supprime tous les paramètres d'un client
     * @param clientId ID du client
     */
    void deleteByClientId(Long clientId);
}
