import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('User login data:', this.loginForm.value);
      // Appel au service d'authentification
    }
  }
  
}
