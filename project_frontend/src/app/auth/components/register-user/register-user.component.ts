import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent {
  passwordError = ''
  passwordCheck=true;
  signUpForm = this.fb.group({
        name: ['', Validators.required],

        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required] , 
        password2: ['', Validators.required]
      });
      checkPasswordMatch() {
        const password = this.signUpForm.get('password')?.value;
        const password2 = this.signUpForm.get('password2')?.value;
    
        if (password !== password2) {
          this.passwordError = 'Les mots de passe ne correspondent pas';
          this.passwordCheck=false;
        } else {
          this.passwordError = '';
          this.passwordCheck=true;

        }
      }
      constructor(private fb: FormBuilder , private authService: AuthService) {}
    
      onSubmit() {
        this.checkPasswordMatch();
        if (this.signUpForm.valid  && this.passwordCheck) {
          console.log('User Signing Up data:', this.signUpForm.value);
          this.authService.signUp(this.signUpForm.value).subscribe({
            next: (response) => {
              console.log('Inscription réussie', response);
              // Redirection ou message de succès
            },
            error: (err) => {
              console.error('Erreur lors de l\'inscription', err);
              // Gestion des erreurs
            }
          });
        }
      }

}
