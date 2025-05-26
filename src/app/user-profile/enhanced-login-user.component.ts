import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginHandlerService } from './login-handler.service';

@Component({
  selector: 'app-enhanced-login-user',
  templateUrl: './enhanced-login-user.component.html',
  styleUrls: ['./enhanced-login-user.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class EnhancedLoginUserComponent {
  @Output() loginSuccess = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  
  loginForm: FormGroup;
  loginError: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private loginHandlerService: LoginHandlerService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = null;
      
      this.loginHandlerService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.loginSuccess.emit();
          this.closeModal.emit(); // Fermer le modal après connexion réussie
        },
        error: (err) => {
          this.isLoading = false;
          this.loginError = 'Identifiants incorrects. Veuillez réessayer.';
          console.error('Erreur lors de la connexion', err);
        }
      });
    }
  }
}
