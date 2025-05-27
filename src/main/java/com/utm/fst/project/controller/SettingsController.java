package com.utm.fst.project.controller;

import com.utm.fst.project.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = "*")
public class SettingsController {

    private final SettingsService settingsService;

    @Autowired
    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    /**
     * Récupère tous les paramètres d'un client
     * @param clientId ID du client
     * @return Map contenant tous les paramètres du client
     */
    @GetMapping("/{clientId}")
    public ResponseEntity<Map<String, Object>> getClientSettings(@PathVariable Long clientId) {
        Map<String, Object> settings = settingsService.getClientSettings(clientId);
        return ResponseEntity.ok(settings);
    }

    /**
     * Sauvegarde un paramètre spécifique pour un client
     * @param requestBody Map contenant les données du paramètre à sauvegarder
     * @return true si la sauvegarde a réussi, false sinon
     */
    @PostMapping("/save")
    public ResponseEntity<Boolean> saveClientSetting(@RequestBody Map<String, Object> requestBody) {
        Long clientId = Long.valueOf(requestBody.get("clientId").toString());
        String settingType = (String) requestBody.get("settingType");
        Object settingValue = requestBody.get("settings");

        boolean success = settingsService.saveClientSetting(clientId, settingType, settingValue);
        
        if (success) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }

    /**
     * Supprime tous les paramètres d'un client
     * @param clientId ID du client
     * @return true si la suppression a réussi, false sinon
     */
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Boolean> deleteClientSettings(@PathVariable Long clientId) {
        boolean success = settingsService.deleteClientSettings(clientId);
        
        if (success) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
