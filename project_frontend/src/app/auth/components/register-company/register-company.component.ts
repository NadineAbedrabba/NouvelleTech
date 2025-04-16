import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css']
})
export class RegisterCompanyComponent {
   passwordError = ''
    passwordCheck=true;
    signUpForm = this.fb.group({
          name: ['', Validators.required],
  
          email: ['', [Validators.required, Validators.email]],
          nomEntreprise: ['', Validators.required],
          secteur: ['', Validators.required],
          adresse: ['', Validators.required],
          tel: ['', Validators.required],
          specialite: ['', Validators.required],
          password: ['', Validators.required] , 
          password2: ['', Validators.required],
          
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
          const { name, email, nomEntreprise, secteur, adresse, tel, specialite, password } = this.signUpForm.value;

          const payload = { name,email,nomEntreprise,secteur,adresse,tel,specialite,password};
          if (this.signUpForm.valid  && this.passwordCheck) {
            console.log('User Signing Up data:', payload);
            this.authService.signUpEntreprise(payload).subscribe({
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
