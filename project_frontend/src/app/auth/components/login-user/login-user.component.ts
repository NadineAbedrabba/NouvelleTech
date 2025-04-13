import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';


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

  constructor(private fb: FormBuilder , private authService: AuthService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('User login data:', this.loginForm.value);

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
