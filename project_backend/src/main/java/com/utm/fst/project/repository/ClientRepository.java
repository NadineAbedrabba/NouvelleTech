package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    // Tu peux ajouter des méthodes personnalisées ici si besoin
    // Par exemple : Optional<Client> findByEmail(String email);
}
