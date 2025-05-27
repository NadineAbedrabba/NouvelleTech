import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginUserComponent } from '../auth/components/login-user/login-user.component';
import { LoginHandlerService } from './login-handler.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-wrapper',
  template: `
    <div class="login-wrapper">
      <app-login-user (loginSubmitted)="handleLogin($event)"></app-login-user>
    </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule, LoginUserComponent, FormsModule, ReactiveFormsModule]
})
export class LoginWrapperComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  constructor(private loginHandlerService: LoginHandlerService) {}

  handleLogin(credentials: any): void {
    this.loginHandlerService.login(credentials).subscribe({
      next: (response) => {
        console.log('Connexion réussie', response);
        this.loginSuccess.emit();
        this.closeModal.emit(); // Fermer le modal après connexion réussie
      },
      error: (err) => {
        console.error('Erreur lors de la connexion', err);
      }
    });
  }
}
