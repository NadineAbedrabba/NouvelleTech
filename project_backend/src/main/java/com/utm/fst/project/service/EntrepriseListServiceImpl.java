package com.utm.fst.project.service;
import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.exception.NotFoundException;
import com.utm.fst.project.repository.EntrepriseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import java.util.ArrayList;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EntrepriseListServiceImpl implements EntrepriseListService {

    private final EntrepriseRepository entrepriseRepository;

    @Override
    public void ajouterElement(Long id, String listeName, String valeur) {
        Entreprise entreprise = getEntreprise(id);
        getListeReference(entreprise, listeName).add(valeur);
        entrepriseRepository.save(entreprise);
    }

    @Override
    public void supprimerElement(Long id, String listeName, String valeur) {
        Entreprise entreprise = getEntreprise(id);
        getListeReference(entreprise, listeName).remove(valeur);
        entrepriseRepository.save(entreprise);
    }

    @Override
    public List<String> getListe(Long id, String listeName) {
        return new ArrayList<>(getListeReference(getEntreprise(id), listeName));
    }

    // Méthodes helper
    private List<String> getListeReference(Entreprise entreprise, String listeName) {
        switch(listeName.toLowerCase()) {
            case "services":
                return Optional.ofNullable(entreprise.getServices())
                        .orElseGet(() -> {
                            List<String> newList = new ArrayList<>();
                            entreprise.setServices(newList);
                            return newList;
                        });

            case "optionsalimentaires":
                return Optional.ofNullable(entreprise.getOptionsAlimentaires())
                        .orElseGet(() -> {
                            List<String> newList = new ArrayList<>();
                            entreprise.setOptionsAlimentaires(newList);
                            return newList;
                        });
            case "experiences":
                return Optional.ofNullable(entreprise.getExperiences())
                        .orElseGet(() -> {
                            List<String> newList = new ArrayList<>();
                            entreprise.setExperiences(newList);
                            return newList;
                        });

            case "accesibilité":
                return Optional.ofNullable(entreprise.getAccesibilite())
                        .orElseGet(() -> {
                            List<String> newList = new ArrayList<>();
                            entreprise.setAccesibilite(newList);
                            return newList;
                        });

            case "caracteristiquerepas":
                return Optional.ofNullable(entreprise.getCaracteristiqueRepas())
                        .orElseGet(() -> {
                            List<String> newList = new ArrayList<>();
                            entreprise.setCaracteristiqueRepas(newList);
                            return newList;
                        });
            default:
                throw new IllegalArgumentException("Liste inconnue: " + listeName);
        }
    }

    private Entreprise getEntreprise(Long id) {
        return entrepriseRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Entreprise non trouvée"));
    }
}