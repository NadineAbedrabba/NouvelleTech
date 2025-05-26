package com.utm.fst.project.dto;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private final String token;
    private final Long entrepriseId;

    public AuthenticationResponse(String token, Long entrepriseId) {
        this.token = token;
        this.entrepriseId = entrepriseId;
    }

    public String getToken() {
        return token;
    }

    public Long getEntrepriseId() {
        return entrepriseId;
    }
}