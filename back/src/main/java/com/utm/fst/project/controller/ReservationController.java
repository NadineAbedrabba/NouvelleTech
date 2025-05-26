package com.utm.fst.project.controller;

import com.utm.fst.project.dto.ReservationRequest;
import com.utm.fst.project.dto.ReservationResponse; // Correction du package
import com.utm.fst.project.dto.ReservationUpdateDTO;
import com.utm.fst.project.entities.Reservation;
import com.utm.fst.project.service.ReservationService;
import lombok.RequiredArgsConstructor;
import com.utm.fst.project.enums.ReservationStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
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


    @GetMapping("/stats/total")
    public Long getTotalReservations() {
        return reservationService.countTotalReservations();
    }

    @GetMapping("/stats/monthly-comparison")
    public Map<String, Long> getMonthlyComparison() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("current", reservationService.countReservationsThisMonth());
        stats.put("previous", reservationService.countReservationsLastMonth());
        return stats;
    }

    @GetMapping("/stats/monthly")
    public List<Map<String, Object>> getMonthlyReservations() {
        return reservationService.getMonthlyReservations().stream()
                .map(arr -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("month", arr[0]);
                    map.put("count", arr[1]);
                    return map;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/stats/by-status")
    public Map<String, Long> getReservationsByStatus() {
        return reservationService.getReservationsByStatus().stream()
                .collect(Collectors.toMap(
                        arr -> ((ReservationStatus) arr[0]).name().toLowerCase(),  // Correction ici
                        arr -> (Long) arr[1]
                ));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public ResponseEntity<List<Reservation>> getReservationsByClientEmail(@RequestParam String clientEmail) {
        List<Reservation> reservations = reservationService.getReservationsByClientEmail(clientEmail);
        return ResponseEntity.ok(reservations);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long id,
                                                         @RequestBody ReservationUpdateDTO dto) {
        try {
            Reservation updated = reservationService.updateReservation(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

    }
}
