import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HoraireJournalier } from 'src/app/models/restaurant.model';

@Component({
  selector: 'app-disponibility',
    standalone: true,
  templateUrl: './disponibility.component.html',
  styleUrls: ['./disponibility.component.css']
})
export class DisponibilityComponent implements AfterViewInit {
  @ViewChild('disp1') disp1!: ElementRef<HTMLInputElement>;
  @ViewChild('disp2') disp2!: ElementRef<HTMLInputElement>;
  @ViewChild('dateSelect') dateSelect!: ElementRef<HTMLInputElement>;
  @ViewChild('timeSelect') timeSelect!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    this.setupAvailabilityListeners();
  }

  private setupAvailabilityListeners(): void {
    // Activer/désactiver les sélecteurs de date/heure selon le choix
    this.disp1.nativeElement.addEventListener('change', () => {
      this.toggleDateTimeInputs(false);
    });

    this.disp2.nativeElement.addEventListener('change', () => {
      this.toggleDateTimeInputs(true);
    });

    // Initialiser l'état
    this.toggleDateTimeInputs(this.disp2.nativeElement.checked);
  }

  private toggleDateTimeInputs(enable: boolean): void {
    const dateTimeInputs = document.querySelectorAll('.dispo-jour-heure');
    dateTimeInputs.forEach(input => {
      if (enable) {
        input.classList.add('active');
        input.querySelector('input')?.removeAttribute('disabled');
      } else {
        input.classList.remove('active');
        input.querySelector('input')?.setAttribute('disabled', 'true');
      }
    });
  }

  // Changement: méthode maintenant publique pour être accessible depuis le template
  resetAvailability(): void {
    // Réinitialiser les boutons radio
    this.disp1.nativeElement.checked = false;
    this.disp2.nativeElement.checked = false;
    
    // Réinitialiser les champs date et heure
    this.dateSelect.nativeElement.value = '';
    this.timeSelect.nativeElement.value = '';
    
    // Désactiver les champs
    this.toggleDateTimeInputs(false);
  }

  get selectedAvailability(): { isOpenNow: boolean, date?: string, time?: string } {
    return {
      isOpenNow: this.disp1.nativeElement.checked,
      date: this.disp2.nativeElement.checked ? this.dateSelect.nativeElement.value : undefined,
      time: this.disp2.nativeElement.checked ? this.timeSelect.nativeElement.value : undefined
    };
  }

  isOuvertMaintenant(horaire: HoraireJournalier): boolean {
    if (horaire.estFerme) {
      // Fermé toute la journée
      return false;
    }
  
    // Heure actuelle au format "HH:mm"
    const maintenant = new Date();
    const heureActuelle = maintenant.getHours() * 60 + maintenant.getMinutes(); // minutes totales depuis minuit
  
    // Convertir heureOuverture "HH:mm" en minutes depuis minuit
    const [hOuverture, mOuverture] = horaire.heureOuverture.split(':').map(Number);
    const ouverture = hOuverture * 60 + mOuverture;
  
    // Convertir heureFermeture "HH:mm" en minutes depuis minuit
    const [hFermeture, mFermeture] = horaire.heureFermeture.split(':').map(Number);
    const fermeture = hFermeture * 60 + mFermeture;
  
    // Vérifier si on est dans l'intervalle [ouverture, fermeture[
    return heureActuelle >= ouverture && heureActuelle < fermeture;
  }
  
}