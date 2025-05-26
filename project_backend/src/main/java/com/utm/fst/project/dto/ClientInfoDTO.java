package com.utm.fst.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ClientInfoDTO {
    private Long id;
    private String nom;
    private String email;
    private String photoUrl; // URL de l'image de profil
    
    public ClientInfoDTO(Long id, String nom, String photoUrl) {
        this.id = id;
        this.nom = nom;
        this.photoUrl = photoUrl;
    }
    
    public ClientInfoDTO(Long id, String nom, String email, String photoUrl) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.photoUrl = photoUrl;
    }
}