package com.utm.fst.project.service.Entreprise;

import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UserDTO;

public interface EntrepriseService {
    UserDTO registerEntreprise(EntrepriseSignupDTO entrepriseSignupDTO);

}
