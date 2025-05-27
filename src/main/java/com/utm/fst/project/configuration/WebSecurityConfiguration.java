package com.utm.fst.project.configuration;
import com.utm.fst.project.filters.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfiguration {
    @Autowired
    private JwtRequestFilter authFilter;

    // 1. First define the CORS configuration bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 2. Then define the security filter chain that uses it
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        System.out.println("Configuring security filter chain...");
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> {
                    // Endpoints publics avec méthodes spécifiques
                    auth.requestMatchers(HttpMethod.GET, "/entreprise/**").permitAll();
                    auth.requestMatchers(HttpMethod.DELETE, "/entreprise/**").permitAll();
                    auth.requestMatchers(HttpMethod.GET, "/review/api/reviews/**").permitAll();
                    
                    // Endpoints publics pour les avis de site (GET et POST)
                    auth.requestMatchers(HttpMethod.GET, "/api/site-reviews/**").permitAll();
                    auth.requestMatchers(HttpMethod.POST, "/api/site-reviews").permitAll();
                    System.out.println("POST /api/site-reviews configuré comme public");
                    
                    // Autres endpoints publics
                    auth.requestMatchers(
                            "/authenticate", "/sign-up", "/entreprise/register",
                            "/swagger-ui/index.html",
                            "/entreprise/**",
                            "/v3/api-docs/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/favicon.ico",
                            "/webjars/**",
                            "/api/entreprises/**", "/api/images/**",
                            "/client/register/**",
                            "/api/reviews/**",
                            "/client/**",
                            "/entreprise/**",
                            "/api/reservations/**",
                            "/api/images",
                            "/settings/**"
                    ).permitAll();
                    
                    // Préflight CORS
                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                    
                    // Tous les autres endpoints API nécessitent une authentification
                    auth.requestMatchers("/api/**").authenticated();
                })
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}