package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;

public interface ClientService {
    UserDTO registerClient(ClientSignupDTO dto);
}
