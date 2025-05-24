package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;


public interface ClientService {
    UserDTO registerClient(ClientSignupDTO dto);
    ClientInfoDTO getClientInfo(Long id);
}
