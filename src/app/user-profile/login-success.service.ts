import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginSuccessService {
  private welcomeMessageSubject = new BehaviorSubject<string | null>(null);
  welcomeMessage$ = this.welcomeMessageSubject.asObservable();

  constructor() {}

  // Afficher un message de bienvenue
  showWelcomeMessage(username: string): void {
    this.welcomeMessageSubject.next(`Bienvenue, ${username}!`);
    
    // Effacer le message après 5 secondes
    setTimeout(() => {
      this.welcomeMessageSubject.next(null);
    }, 5000);
  }

  // Effacer le message de bienvenue
  clearWelcomeMessage(): void {
    this.welcomeMessageSubject.next(null);
  }
}
