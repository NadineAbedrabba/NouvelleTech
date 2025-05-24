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
    public AuthenticationResponse createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest , HttpServletResponse response) throws BadCredentialsException,DisabledException,UsernameNotFoundException, IOException, JSONException , ServletException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
            System.out.println("✅ Authentification réussie pour : " + authenticationRequest.getEmail());

        } catch (BadCredentialsException e) {
            System.out.println("❌ Mauvais identifiants pour : " + authenticationRequest.getEmail());

            throw new BadCredentialsException("username or password is incorrect");
        } catch (DisabledException disabledException) {
            response.sendError(HttpServletResponse.SC_NOT_ACCEPTABLE, "user not activated");
            return null;
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        User user = userRepository.findFirstByEmail(authenticationRequest.getEmail());
        final String jwt = jwtUtil.generateToken(authenticationRequest.getEmail());
        System.out.println("📦 Réponse envoyée : " + new AuthenticationResponse(jwt));

        System.out.println("🚀 Token généré : " + jwt);

        return new AuthenticationResponse( jwt );
    }
}
