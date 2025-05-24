package com.utm.fst.project.dto;

import com.utm.fst.project.enums.UserRole;
import lombok.Data;


@Data
public class UserDTO {
    private Long id;
    private String email;
    private UserRole userRole;
    // Pas de password ici !
}