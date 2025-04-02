package com.utm.fst.project.service.user;

import com.utm.fst.project.dto.SignupDTO;
import com.utm.fst.project.dto.UserDTO;

public interface UserService {
    UserDTO createUser(SignupDTO signupDTO);

    boolean hasUserWithEmail(String email);
}
