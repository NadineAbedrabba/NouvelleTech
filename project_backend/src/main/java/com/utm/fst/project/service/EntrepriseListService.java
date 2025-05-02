package com.utm.fst.project.service;

import java.util.List;

public interface EntrepriseListService {
    void ajouterElement(Long id, String listeName, String valeur);
    void supprimerElement(Long id, String listeName, String valeur);
    List<String> getListe(Long id, String listeName);
}