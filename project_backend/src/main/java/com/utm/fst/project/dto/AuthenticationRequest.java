package com.utm.fst.project.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {

    private String email;
    private String password;
}
