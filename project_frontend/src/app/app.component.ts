import { Component, OnInit } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { WelcomeToastComponent } from './user-profile/welcome-toast/welcome-toast.component';
import { ThemeService } from './services/theme.service';

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
export class AppComponent implements OnInit {
  title = 'project_frontend';
  showAuthModal = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Appliquer le mode sombre au chargement de l'application
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
      document.body.classList.add('dark-theme');
    }
    // Le ThemeService va automatiquement initialiser le thème
    // en fonction des préférences de l'utilisateur
  }

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}



