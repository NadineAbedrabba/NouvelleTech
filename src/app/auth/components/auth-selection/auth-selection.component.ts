import { Component, EventEmitter, Output } from '@angular/core';
import { LoginCompanyComponent } from '../login-company/login-company.component';
import { LoginUserComponent } from '../login-user/login-user.component';
import { CommonModule } from '@angular/common';
import { RegisterUserComponent } from '../register-user/register-user.component';
import { RegisterCompanyComponent } from '../register-company/register-company.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-selection',
  templateUrl: './auth-selection.component.html',
  styleUrls: ['./auth-selection.component.css'],
imports: [
    CommonModule,
    LoginUserComponent,
    LoginCompanyComponent,
    RegisterUserComponent,
    RegisterCompanyComponent,
    ReactiveFormsModule,
  ],
  standalone:true
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