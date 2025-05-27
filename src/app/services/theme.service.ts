import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  darkMode$: Observable<boolean> = this.darkModeSubject.asObservable();

  constructor() {
    // Initialiser le mode sombre depuis le localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Utiliser la valeur sauvegardée ou la préférence du système
    const initialDarkMode = savedDarkMode ? savedDarkMode === 'true' : prefersDark;
    
    this.darkModeSubject.next(initialDarkMode);
    this.applyTheme(initialDarkMode);
  }

  setDarkMode(isDarkMode: boolean): void {
    this.darkModeSubject.next(isDarkMode);
    this.applyTheme(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }

  toggleDarkMode(): void {
    const currentMode = this.darkModeSubject.value;
    this.setDarkMode(!currentMode);
  }

  private applyTheme(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
