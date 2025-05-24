import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantService } from 'src/app/services/restaurant.service';

@Component({
  selector: 'app-restaurant-pending',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './restaurant-pending.component.html',
  styleUrls: ['./restaurant-pending.component.scss']
})
export class RestaurantPendingComponent implements OnInit {
  restaurant?: Restaurant;
  isLoading: boolean = true;

  safeMapUrl!: SafeResourceUrl;
  adminNotes = '';
  showDecisionForm = false;
  currentDecision: 'approve' | 'reject' | null = null;
  

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.restaurantService.getRestaurantById(id).subscribe({
        next: (data) => {
          this.restaurant = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du restaurant', err);
          this.isLoading = false;
        }
      });
    }
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

  setMapUrl(address: string): void {
    const encodedAddress = encodeURIComponent(address);
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodedAddress}&output=embed&zoom=15`
    );
  }
}