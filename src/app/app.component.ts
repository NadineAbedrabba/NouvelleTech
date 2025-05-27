import { Component } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeToastComponent } from './user-profile/welcome-toast/welcome-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    AuthModule,
    NgIf,
    CommonModule,
    HeaderComponent,
    FooterComponent,
    WelcomeToastComponent
  ]
})
export class AppComponent {
  title = 'project_frontend';
  showAuthModal = false;

  constructor(private router: Router) {}

  isAdminOrEnterpriseRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith('/EspaceAdmin') || currentUrl.startsWith('/EspaceEntreprise');
  }

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}