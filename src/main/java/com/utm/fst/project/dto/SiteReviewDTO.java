package com.utm.fst.project.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SiteReviewDTO {
    private Long id;
    private int rating;
    private String commentaire;
    private LocalDateTime createdAt;
    
    // Peut être soit un Long directement, soit un objet contenant un champ 'id'
    private Object clientObj;
    
    private String clientName; // Pour afficher le nom du client dans l'interface
    
    // Getter personnalisé pour extraire l'ID client de différentes façons
    public Long getClientId() {
        if (clientObj == null) {
            return null;
        }
        
        // Si c'est déjà un Long
        if (clientObj instanceof Long) {
            return (Long) clientObj;
        }
        
        // Si c'est un Integer, convertir en Long
        if (clientObj instanceof Integer) {
            return ((Integer) clientObj).longValue();
        }
        
        // Si c'est un String qui représente un nombre
        if (clientObj instanceof String) {
            try {
                return Long.parseLong((String) clientObj);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        
        // Si c'est un objet Map (comme un objet JSON désérialisé)
        if (clientObj instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) clientObj;
            Object idObj = map.get("id");
            if (idObj != null) {
                if (idObj instanceof Number) {
                    return ((Number) idObj).longValue();
                } else if (idObj instanceof String) {
                    try {
                        return Long.parseLong((String) idObj);
                    } catch (NumberFormatException e) {
                        return null;
                    }
                }
            }
        }
        
        return null;
    }
    
    // Setter pour clientId qui stocke dans clientObj
    public void setClientId(Long clientId) {
        this.clientObj = clientId;
    }
    
    // Méthode pour accepter un objet client du frontend
    @JsonProperty("clientId")
    public void setClientObject(Object clientObj) {
        this.clientObj = clientObj;
    }
    
    @Override
    public String toString() {
        return "SiteReviewDTO{" +
                "id=" + id +
                ", rating=" + rating +
                ", commentaire='" + commentaire + '\'' +
                ", createdAt=" + createdAt +
                ", clientId=" + getClientId() +
                ", clientObj=" + clientObj +
                ", clientName='" + clientName + '\'' +
                '}';
    }
}
