package com.utm.fst.project.controller;

import com.utm.fst.project.dto.ClientSignupDTO;
import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.dto.ClientInfoDTO;
import com.utm.fst.project.service.ClientService;
import com.utm.fst.project.service.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/client")
public class ClientController {

    private final ClientService clientService;
    private final UserService userService;

    // Constructeur pour l'injection des dépendances
    public ClientController(ClientService clientService, UserService userService) {
        this.clientService = clientService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody ClientSignupDTO dto) {
        if (userService.hasUserWithEmail(dto.getEmail())) {
            return new ResponseEntity<>("L'utilisateur avec cet email existe déjà.", HttpStatus.NOT_ACCEPTABLE);
        }

        UserDTO created = clientService.registerClient(dto);
        if (created == null) {
            return new ResponseEntity<>("Erreur lors de la création du client. Essayez plus tard.", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ClientInfoDTO> getClientById(@PathVariable Long id) {
        ClientInfoDTO clientInfo = clientService.getClientInfo(id);
        if (clientInfo != null) {
            return new ResponseEntity<>(clientInfo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
