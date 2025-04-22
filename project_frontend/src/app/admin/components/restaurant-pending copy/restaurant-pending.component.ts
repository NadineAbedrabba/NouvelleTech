import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurant-pending',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurant-pending.component.html',
  styleUrls: ['./restaurant-pending.component.scss']
})
export class RestaurantPendingComponent {
  restaurant = {
    matricule: 'REST-2023-0456',
    nom: 'Le Jardin des Délices',
    email: 'contact@jardindesdelices.com',
    statut: 'En attente de validation',
    telephone: '+33 1 45 67 89 01',
    localisation: '18 Rue Gastronomique, 75008 Paris, France',
    typeCuisine: 'Française contemporaine',
    gammePrix: '50-150DT',
    horaireDeTravail: '08:00 - 22:00',
    Service: ['Réservation en ligne', 'Service en salle', 'Terrasse chauffée', 'Cave à vin'],
    optionAlimentaires: ['Végétarien', 'Vegan', 'Sans gluten', 'Produits locaux'],
    accesibilite: ['Accès PMR', 'Toilettes adaptées', 'Placement assis à l\'entrée'],
    experience: ['Dîner romantique', 'Repas d\'affaires'],
    acceptReservation: false,
    livraisonDisponible: true,
    description: 'Un cadre élégant proposant une cuisine française réinventée avec des produits locaux et de saison.'
  };

  safeMapUrl: SafeResourceUrl;
  adminNotes = '';
  showDecisionForm = false;
  currentDecision: 'approve' | 'reject' | null = null;

  constructor(private sanitizer: DomSanitizer) {
    const address = encodeURIComponent(this.restaurant.localisation);
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${address}&output=embed&zoom=16&language=fr`
    );
  }

  prepareDecision(decision: 'approve' | 'reject') {
    this.currentDecision = decision;
    this.showDecisionForm = true;
  }

  submitDecision() {
    if (this.currentDecision === 'reject' && !this.adminNotes.trim()) {
      alert('Veuillez saisir un motif de refus');
      return;
    }

    if (this.currentDecision === 'approve') {
      console.log('Restaurant approuvé');
      // Logique d'approbation
    } else {
      console.log('Restaurant rejeté avec motif:', this.adminNotes);
      // Logique de rejet
    }

    this.resetDecisionForm();
  }

  cancelDecision() {
    this.resetDecisionForm();
  }

  private resetDecisionForm() {
    this.adminNotes = '';
    this.showDecisionForm = false;
    this.currentDecision = null;
  }

  parseHours(hours: string) {
    return hours.split('\n').map(line => {
      const [day, ...timeParts] = line.split(': ');
      return {
        day: day.trim(),
        hours: timeParts.join(': ')
      };
    });
  }
}