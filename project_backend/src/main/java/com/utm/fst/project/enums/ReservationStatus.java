package com.utm.fst.project.enums;

public enum ReservationStatus {
    EN_ATTENTE("En attente"),
    CONFIRMEE("Confirmée"),
    REFUSEE("Refusée");

    private final String displayName;

    ReservationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}