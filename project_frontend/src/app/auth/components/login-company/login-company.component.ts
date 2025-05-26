import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-company',
  templateUrl: './login-company.component.html',
  styleUrls: ['./login-company.component.css']
})
export class LoginCompanyComponent {
  loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  
    constructor(private fb: FormBuilder , private authService:AuthService) {}
  
    onSubmit() {
      if (this.loginForm.valid) {
        console.log('Compaany login data:', this.loginForm.value);
        
        if (this.loginForm.valid) {
          console.log('Company login data:', this.loginForm.value);
    
            this.authService.authenticate(this.loginForm.value).subscribe({
              next: (response) => {
                console.log('Login réussie', response);
              },
              error: (err) => {
                console.error('Erreur lors du login', err);
              }
            });
          }

      }
    }
   
}