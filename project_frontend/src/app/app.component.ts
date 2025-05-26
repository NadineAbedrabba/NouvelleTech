import { Component } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf } from '@angular/common';
import { EntrepriseLayoutComponent } from "./entreprise/components/entreprise-layout/entreprise-layout.component"; // ✅ import NgIf
import { RouterModule } from '@angular/router';
import { AuthSelectionComponent } from "./auth/components/auth-selection/auth-selection.component";
import { LoginUserComponent } from './auth/components/login-user/login-user.component';
import { RegisterUserComponent } from './auth/components/register-user/register-user.component';
import { LoginCompanyComponent } from './auth/components/login-company/login-company.component';
import { RegisterCompanyComponent } from './auth/components/register-company/register-company.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    AuthModule,
    NgIf,
    EntrepriseLayoutComponent,
    RouterModule,
    AuthSelectionComponent,
    LoginUserComponent,
    RegisterUserComponent,
    LoginCompanyComponent,
    RegisterCompanyComponent,
]
})
export class AppComponent {
  title = 'project_frontend';
  showAuthModal = false;

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}
