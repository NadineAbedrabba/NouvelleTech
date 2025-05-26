package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.ClientUpdateDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;
import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.Entreprise;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.enums.UserRole;
import com.utm.fst.project.repository.ClientRepository;
import com.utm.fst.project.repository.EntrepriseRepository;
import com.utm.fst.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntrepriseRepository entrepriseRepository;

    private ClientRepository clientRepository;


    @Override
    public UserDTO registerClient(ClientSignupDTO dto) {
        Client client = new Client();
        client.setEmail(dto.getEmail());
        client.setPassword(passwordEncoder.encode(dto.getPassword()));
        client.setNom(dto.getNom());
        client.setUserRole(UserRole.CLIENT);

        Client savedClient = userRepository.save(client);
        return mapToUserDTO(savedClient);
    }

    @Override
    public ClientInfoDTO getClientInfo(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get() instanceof Client) {
            Client client = (Client) userOpt.get();
            return new ClientInfoDTO(
                    client.getId(),
                    client.getNom(),
                    client.getImage() != null ? client.getImage().getLien() : "/assets/images/default-avatar.png"
            );
        }
        return null;
    }

    private UserDTO mapToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUserRole(user.getUserRole());
        return dto;
    }

    @Override
    public UserDTO updateClient(Long id, ClientUpdateDTO dto) {
        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isEmpty() || !(userOpt.get() instanceof Client)) {
            throw new RuntimeException("Client non trouvé.");
        }

        Client client = (Client) userOpt.get();

        if (dto.getNom() != null) client.setNom(dto.getNom());
        if (dto.getEmail() != null) client.setEmail(dto.getEmail());
        if (dto.getPassword() != null) client.setPassword(passwordEncoder.encode(dto.getPassword()));

        if (dto.getEntrepriseId() != null) {
            Optional<Entreprise> entrepriseOpt = entrepriseRepository.findById(dto.getEntrepriseId());
            if (entrepriseOpt.isEmpty()) {
                throw new RuntimeException("Entreprise non trouvée avec l'id : " + dto.getEntrepriseId());
            }
            client.setEntreprise(entrepriseOpt.get());
        }

        Client updated = userRepository.save(client);
        return mapToUserDTO(updated);
    }
    @Override
    public Long getClientIdByEmail(String email) {
        User user = userRepository.findFirstByEmail(email);
        if (user != null && user instanceof Client) {
            return user.getId();
        }
        return null;
    }
    @Override
    public Long countTotalClients() {
        return clientRepository.countTotalClients();
    }

    @Override
    public Long countClientsThisMonth() {
        return clientRepository.countClientsThisMonth();
    }

    @Override
    public Long countClientsLastMonth() {
        LocalDateTime startOfThisMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime startOfLastMonth = startOfThisMonth.minusMonths(1);
        return clientRepository.countClientsLastMonth(startOfLastMonth, startOfThisMonth);
    }


    @Override
    public List<Object[]> getMonthlyClients() {
        return clientRepository.getMonthlyClients();
    }

}