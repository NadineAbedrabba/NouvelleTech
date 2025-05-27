import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-company',
  imports:[ ReactiveFormsModule, CommonModule ],
  standalone:true,

  templateUrl: './login-company.component.html',
  styleUrls: ['./login-company.component.css']
})
export class LoginCompanyComponent {
 
  @Output() closeModal = new EventEmitter<void>();
  loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  
    constructor(private fb: FormBuilder , private authService:AuthService,private router: Router) {}
  
    onSubmit() {
      if (this.loginForm.valid) {
        this.authService.authenticate(this.loginForm.value).subscribe({
          next: (response) => {
            console.log('Login réussi', response);
            if (response.entrepriseId) {
              localStorage.setItem('entrepriseId', response.entrepriseId.toString());
              this.router.navigate(['/EspaceEntreprise', response.entrepriseId, 'dashboard']);
              
              // Émettre l'événement pour fermer la modal
              this.closeModal.emit();
            }
          },
          error: (err) => {
            console.error('Erreur de connexion', err);
          }
        });
      }
    }
   
}