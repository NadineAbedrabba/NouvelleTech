package com.utm.fst.project.dto;

import com.utm.fst.project.enums.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private Long id ;
    private String name ;
    private String email ;
    private String password ;

    private UserRole userRole ;
//    private byte[] img ;


}
