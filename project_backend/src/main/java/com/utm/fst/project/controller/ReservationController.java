package com.utm.fst.project.controller;

import com.utm.fst.project.dto.ReservationRequest;
import com.utm.fst.project.dto.ReservationResponse; // Correction du package
import com.utm.fst.project.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class ReservationController {
    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse createReservation(@RequestBody ReservationRequest request) {
        return reservationService.createReservation(request);
    }

    @GetMapping("/company/{companyId}")
    public List<ReservationResponse> getEntrepriseReservations(@PathVariable Long companyId) {
        return reservationService.getReservationsByEntreprise(companyId);
    }

    @GetMapping("/{id}")
    public ReservationResponse getReservationById(@PathVariable Long id) {
        return reservationService.getReservationById(id);
    }

    @PutMapping("/{id}/confirm")
    public ReservationResponse confirmReservation(@PathVariable Long id) {
        return reservationService.confirmReservation(id);
    }

    @PutMapping("/{id}/refuse")
    public ReservationResponse refuseReservation(@PathVariable Long id) {
        return reservationService.refuseReservation(id);
    }
}