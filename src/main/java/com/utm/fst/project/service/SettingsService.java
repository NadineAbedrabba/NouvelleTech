package com.utm.fst.project.service;

import java.util.Map;

/**
 * Service pour gérer les paramètres utilisateur
 */
public interface SettingsService {
    
    /**
     * Récupère tous les paramètres d'un client
     * @param clientId ID du client
     * @return Map contenant tous les paramètres du client
     */
    Map<String, Object> getClientSettings(Long clientId);
    
    /**
     * Sauvegarde un paramètre spécifique pour un client
     * @param clientId ID du client
     * @param settingType Type de paramètre (ex: "preferences", "privacy")
     * @param settingValue Valeur du paramètre en format JSON
     * @return true si la sauvegarde a réussi, false sinon
     */
    boolean saveClientSetting(Long clientId, String settingType, Object settingValue);
    
    /**
     * Supprime tous les paramètres d'un client
     * @param clientId ID du client
     * @return true si la suppression a réussi, false sinon
     */
    boolean deleteClientSettings(Long clientId);
}
