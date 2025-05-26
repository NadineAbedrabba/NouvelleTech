package com.utm.fst.project.dto;

import lombok.Data;

@Data
public class ClientUpdateDTO {
    private String nom;
    private String email;
    private String password;
    private Long entrepriseId; // Si tu veux relier un client à une entreprise plus tard
}
