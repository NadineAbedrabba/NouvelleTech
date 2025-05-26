package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.ClientUpdateDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;

import java.util.List;


public interface ClientService {
    UserDTO registerClient(ClientSignupDTO dto);
    ClientInfoDTO getClientInfo(Long id);
    UserDTO updateClient(Long id, ClientUpdateDTO dto);
    Long getClientIdByEmail(String email);
    public Long countTotalClients();
    public Long countClientsThisMonth();
    public Long countClientsLastMonth();
    public List<Object[]> getMonthlyClients(); // chaque Object[] = [mois, total]

}
