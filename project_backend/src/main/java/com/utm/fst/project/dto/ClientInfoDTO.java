package com.utm.fst.project.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClientInfoDTO {
    private Long id;
    private String nom;
    private String photoUrl;
}