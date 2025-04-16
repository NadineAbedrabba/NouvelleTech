package com.utm.fst.project.controller;


import com.utm.fst.project.dto.EntrepriseSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.service.Entreprise.EntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/entreprise")
public class EntrepriseController {
    @Autowired
    private EntrepriseService entrepriseService;

    @PostMapping("/register")
    public UserDTO registerEntreprise(@RequestBody EntrepriseSignupDTO dto) {
        return entrepriseService.registerEntreprise(dto);
    }
}
