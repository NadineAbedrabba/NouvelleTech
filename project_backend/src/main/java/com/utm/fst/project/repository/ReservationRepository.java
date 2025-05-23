package com.utm.fst.project.repository;

import com.utm.fst.project.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByEntrepriseId(Long entrepriseId);
}