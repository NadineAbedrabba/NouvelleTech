package com.utm.fst.project.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteReviewDTO {
    private Long id;
    private int rating;
    private String commentaire;
    private LocalDateTime createdAt;
    private Long clientId;
    private String clientName; // Pour afficher le nom du client dans l'interface
    
    @Override
    public String toString() {
        return "SiteReviewDTO{" +
                "id=" + id +
                ", rating=" + rating +
                ", commentaire='" + commentaire + '\'' +
                ", createdAt=" + createdAt +
                ", clientId=" + clientId +
                ", clientName='" + clientName + '\'' +
                '}';
    }
}
