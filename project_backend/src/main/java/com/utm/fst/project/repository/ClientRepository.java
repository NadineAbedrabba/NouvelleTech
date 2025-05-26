package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Client;
import com.utm.fst.project.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNom(String nom);

}