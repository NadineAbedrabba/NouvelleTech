package com.utm.fst.project.service.Entreprise;

import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.enums.UserRole;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class EntrepriseServiceImpl implements  EntrepriseService{

    @Autowired
    private EntrepriseRepository entrepriseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDTO registerEntreprise(EntrepriseSignupDTO dto) {
        // 1. Save entreprise
        Entreprise entreprise = new Entreprise();
        entreprise.setNomEntreprise(dto.getNomEntreprise());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setSecteur(dto.getSecteur());
        entreprise.setSpecialite(dto.getSpecialite());
        entreprise.setTelephone(dto.getTelephone());
        Entreprise savedEntreprise = entrepriseRepository.save(entreprise);

        // 2. Create user
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(dto.getPassword()));
        user.setUserRole(UserRole.ENTREPRISE);
        user.setEntreprise(savedEntreprise);
        User savedUser = userRepository.save(user);

        // 3. Return DTO
        UserDTO userDTO = new UserDTO();
        userDTO.setId(savedUser.getId());
        userDTO.setName(savedUser.getName());
        userDTO.setEmail(savedUser.getEmail());
        userDTO.setUserRole(savedUser.getUserRole());

        return userDTO;
    }

}
