package com.utm.fst.project.service;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;
import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.enums.UserRole;
import com.utm.fst.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
}