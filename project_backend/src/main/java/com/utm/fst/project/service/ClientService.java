package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;
import java.util.Map;
import java.util.List;

public interface ClientService {
    UserDTO registerClient(ClientSignupDTO dto);
    ClientInfoDTO getClientInfo(Long id);

    public Long countTotalClients();
    public Long countClientsThisMonth();
    public Long countClientsLastMonth();
    public List<Object[]> getMonthlyClients(); // chaque Object[] = [mois, total]

}
