package com.utm.fst.project.service.Reservation;

import com.utm.fst.project.dto.ReservationRequest; // Package corrigé
import com.utm.fst.project.dto.ReservationResponse; // Package corrigé
import com.utm.fst.project.dto.ReservationUpdateDTO;
import com.utm.fst.project.entities.*;
import com.utm.fst.project.enums.ReservationStatus;
import com.utm.fst.project.repository.EntrepriseRepository; // Package corrigé
import com.utm.fst.project.repository.ReservationRepository; // Package corrigé
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final EntrepriseRepository entrepriseRepository;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        Entreprise entreprise = entrepriseRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Reservation reservation = Reservation.builder()
                .reservationDate(request.getReservationDate())
                .arrivalTime(request.getArrivalTime())
                .nbPersonnes(request.getNbPersonnes())
                .preference(request.getPreference())
                .clientNom(request.getClientNom())
                .clientEmail(request.getClientEmail())
                .clientTelephone(request.getClientTelephone())
                .entreprise(entreprise)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);
        return mapToResponse(savedReservation);
    }
    @Transactional
    public Reservation updateReservation(Long id, ReservationUpdateDTO dto) {
        Optional<Reservation> opt = reservationRepository.findById(id);
        if (opt.isEmpty()) {
            throw new RuntimeException("Reservation not found with id: " + id);
        }

        Reservation reservation = opt.get();

        if (dto.getReservationDate() != null) {
            reservation.setReservationDate(dto.getReservationDate());
        }
        if (dto.getArrivalTime() != null) {
            reservation.setArrivalTime(dto.getArrivalTime());
        }
        if (dto.getNbPersonnes() != null) {
            reservation.setNbPersonnes(dto.getNbPersonnes());
        }
        if (dto.getPreference() != null) {
            reservation.setPreference(dto.getPreference());
        }
        if (dto.getClientNom() != null) {
            reservation.setClientNom(dto.getClientNom());
        }
        if (dto.getClientEmail() != null) {
            reservation.setClientEmail(dto.getClientEmail());
        }
        if (dto.getClientTelephone() != null) {
            reservation.setClientTelephone(dto.getClientTelephone());
        }

        return reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsByEntreprise(Long entrepriseId) {
        return reservationRepository.findByEntrepriseId(entrepriseId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReservationResponse getReservationById(Long id) {
        return reservationRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    @Transactional
    public ReservationResponse confirmReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatut(ReservationStatus.CONFIRMEE);
        return mapToResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponse refuseReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        reservation.setStatut(ReservationStatus.REFUSEE);
        return mapToResponse(reservationRepository.save(reservation));
    }
    public List<Reservation> getReservationsByClientEmail(String clientEmail) {
        return reservationRepository.findByClientEmail(clientEmail);
    }
    private ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .createdAt(reservation.getCreatedAt())
                .reservationDate(reservation.getReservationDate())
                .arrivalTime(reservation.getArrivalTime())
                .nbPersonnes(reservation.getNbPersonnes())
                .preference(reservation.getPreference())
                .statut(reservation.getStatut())
                .clientNom(reservation.getClientNom())
                .clientEmail(reservation.getClientEmail())
                .clientTelephone(reservation.getClientTelephone())
                .companyId(reservation.getEntreprise().getId())
                .companyName(reservation.getEntreprise().getNomEntreprise())
                .build();
    }
    public void deleteReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Reservation not found with id " + id));

        reservationRepository.delete(reservation);
    }
}