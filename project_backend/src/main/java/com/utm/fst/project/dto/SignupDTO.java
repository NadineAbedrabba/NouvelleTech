package com.utm.fst.project.dto;

import com.utm.fst.project.enums.UserRole;
import lombok.Data;

@Data
public class SignupDTO {
    private String name ;
    private String email ;
    private String password ;
    private UserRole userRole;
}
