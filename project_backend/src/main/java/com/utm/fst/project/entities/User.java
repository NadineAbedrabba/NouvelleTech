package com.utm.fst.project.entities;

import com.utm.fst.project.dto.UserDTO;
import com.utm.fst.project.enums.UserRole;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;
    @ManyToOne
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;
}