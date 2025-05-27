package com.utm.fst.project.service;

import com.utm.fst.project.entities.Settings;
import com.utm.fst.project.repository.SettingsRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SettingsServiceImpl implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final ObjectMapper objectMapper;

    @Autowired
    public SettingsServiceImpl(SettingsRepository settingsRepository, ObjectMapper objectMapper) {
        this.settingsRepository = settingsRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, Object> getClientSettings(Long clientId) {
        List<Settings> settingsList = settingsRepository.findByClientId(clientId);
        Map<String, Object> result = new HashMap<>();

        for (Settings setting : settingsList) {
            try {
                // Convertir la valeur JSON stockée en objet Java
                Object value = objectMapper.readValue(setting.getSettingValue(), Object.class);
                result.put(setting.getSettingType(), value);
            } catch (JsonProcessingException e) {
                // En cas d'erreur, on met la valeur brute
                result.put(setting.getSettingType(), setting.getSettingValue());
            }
        }

        return result;
    }

    @Override
    @Transactional
    public boolean saveClientSetting(Long clientId, String settingType, Object settingValue) {
        try {
            // Convertir l'objet en JSON
            String jsonValue = objectMapper.writeValueAsString(settingValue);

            // Vérifier si le paramètre existe déjà
            Optional<Settings> existingSetting = settingsRepository.findByClientIdAndSettingType(clientId, settingType);

            if (existingSetting.isPresent()) {
                // Mettre à jour le paramètre existant
                Settings setting = existingSetting.get();
                setting.setSettingValue(jsonValue);
                settingsRepository.save(setting);
            } else {
                // Créer un nouveau paramètre
                Settings newSetting = new Settings(clientId, settingType, jsonValue);
                settingsRepository.save(newSetting);
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean deleteClientSettings(Long clientId) {
        try {
            settingsRepository.deleteByClientId(clientId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}