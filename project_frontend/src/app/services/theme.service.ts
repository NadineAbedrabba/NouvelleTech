import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor() {
    // Récupérer le thème sauvegardé dans le localStorage
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.setDarkMode(savedTheme === 'true');
    } else {
      // Vérifier si l'utilisateur préfère le mode sombre au niveau du système
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkMode(prefersDarkMode);
    }
  }

  setDarkMode(isDarkMode: boolean): void {
    // Sauvegarder le thème dans le localStorage
    localStorage.setItem('darkMode', isDarkMode.toString());
    
    // Mettre à jour le sujet
    this.darkMode.next(isDarkMode);
    
    // Appliquer la classe au document
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  toggleDarkMode(): void {
    this.setDarkMode(!this.darkMode.value);
  }
}
