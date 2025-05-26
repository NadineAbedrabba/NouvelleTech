package com.utm.fst.project.controller;

import com.utm.fst.project.dto.AuthenticationRequest;
import com.utm.fst.project.dto.AuthenticationResponse;
import com.utm.fst.project.entities.User;
import com.utm.fst.project.repository.UserRepository;
import com.utm.fst.project.service.user.UserService;
import com.utm.fst.project.utils.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class AuthenticationController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/authenticate")
    public AuthenticationResponse createAuthenticationToken(
            @RequestBody AuthenticationRequest authenticationRequest,
            HttpServletResponse response
    ) throws BadCredentialsException, DisabledException, UsernameNotFoundException,
            IOException, JSONException, ServletException {

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getEmail(),
                    authenticationRequest.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Identifiant ou mot de passe incorrect");
        } catch (DisabledException disabledException) {
            response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE, "Utilisateur non activé");
            return null;
        }

        // Utilisez la nouvelle méthode avec JOIN FETCH
        User user = userRepository.findFirstByEmailWithEntreprise(authenticationRequest.getEmail());

        if (user == null) {
            throw new UsernameNotFoundException("Utilisateur non trouvé");
        }

        // Ajoutez du logging pour le débogage
        System.out.println("User entreprise: " + (user != null ? user.getId() : "null"));

        Long entrepriseId = user.getId();

        final String jwt = jwtUtil.generateToken(authenticationRequest.getEmail());

        return new AuthenticationResponse(jwt, entrepriseId);
    }
}