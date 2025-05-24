package com.utm.fst.project.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SiteReview {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(length = 1000)
    private String commentaire;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(optional = true)
    @JoinColumn(name = "client_id", nullable = true)
    private Client client;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
