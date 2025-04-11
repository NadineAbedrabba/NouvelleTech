import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
  
    constructor(private fb: FormBuilder) {}
  
    onSubmit() {
      if (this.loginForm.valid) {
        console.log('Compaany login data:', this.loginForm.value);
        // Appel au service d'authentification
      }
    }
   
}
