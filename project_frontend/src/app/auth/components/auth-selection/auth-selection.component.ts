import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-auth-selection',
  templateUrl: './auth-selection.component.html',
  styleUrls: ['./auth-selection.component.css']
})
export class AuthSelectionComponent {
  @Output() closeModal = new EventEmitter<void>();
  currentStep: 'select' | 'form' = 'select';
  activeTab: 'user' | 'restaurant' = 'user';
  activeForm: 'login' | 'signup' = 'login';

  selectTab(tab: 'user' | 'restaurant') {
    this.activeTab = tab;
    this.activeForm = 'login'; // Par défaut, on montre le login
    this.currentStep = 'form'; // On passe à l'étape suivante
  }

  switchForm(form: 'login' | 'signup') {
    this.activeForm = form;
  }

  goBackToSelection() {
    this.currentStep = 'select';
  }

  onClose() {
    this.closeModal.emit();
  }

}