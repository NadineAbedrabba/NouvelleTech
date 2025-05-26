package com.utm.fst.project.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Autoriser toutes les origines
        config.addAllowedOrigin("*");
        
        // Autoriser tous les en-têtes
        config.addAllowedHeader("*");
        
        // Autoriser toutes les méthodes (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        
        // Autoriser les cookies
        config.setAllowCredentials(false);
        
        // Appliquer cette configuration à toutes les routes
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
