// UpdateEntrepriseUserDTO.java
package com.utm.fst.project.dto;

import lombok.Data;

@Data
public class UpdateEntrepriseUserDTO {
    private String email;
    private String oldPassword;
    private String newPassword;
}
