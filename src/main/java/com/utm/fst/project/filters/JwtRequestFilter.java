package com.utm.fst.project.filters;

import com.utm.fst.project.service.jwt.UserDetailsServiceImpl;
import com.utm.fst.project.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService ;

    @Autowired
    private JwtUtil jwtUtil ;

    @Override
    protected void doFilterInternal (HttpServletRequest request , HttpServletResponse response , FilterChain filterChain) throws ServletException , IOException {
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        
        // Log pour les requêtes POST vers /api/site-reviews
        if (requestURI.contains("/api/site-reviews") && "POST".equals(method)) {
            System.out.println("Traitement d'une requête POST vers /api/site-reviews");
            // Pour les requêtes POST vers /api/site-reviews, on laisse passer sans vérifier l'authentification
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");
        System.out.println("URI: " + requestURI + ", Méthode: " + method + ", Auth Header: " + (authHeader != null ? "présent" : "absent"));
        
        String token = null;
        String username = null;
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(token);
                System.out.println("Token JWT valide, username extrait: " + username);
            } catch (Exception e) {
                System.out.println("Erreur lors de l'extraction du username du token: " + e.getMessage());
            }
        }
        
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                System.out.println("UserDetails chargé pour: " + username);
                
                if (jwtUtil.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    System.out.println("Authentification réussie pour: " + username);
                } else {
                    System.out.println("Validation du token échouée pour: " + username);
                }
            } catch (Exception e) {
                System.out.println("Erreur lors du chargement des détails utilisateur: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
