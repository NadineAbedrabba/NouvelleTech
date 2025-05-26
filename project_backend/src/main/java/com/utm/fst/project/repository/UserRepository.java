package com.utm.fst.project.repository;

import com.utm.fst.project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Gardez l'ancienne méthode pour compatibilité
    User findFirstByEmail(String email);

    boolean existsByEmail(String email);

    // Nouvelle méthode avec JOIN FETCH
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.entreprise WHERE u.email = :email")
    User findFirstByEmailWithEntreprise(@Param("email") String email);
}