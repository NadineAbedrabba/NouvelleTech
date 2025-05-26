import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User, Client } from './user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  client: Client | null = null;
  showDropdown = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    // S'abonner aux changements de l'utilisateur connecté
    this.userService.currentUser$.subscribe(user => {
      this.user = user;
    });

    // S'abonner aux changements des informations client
    this.userService.currentClient$.subscribe(client => {
      this.client = client;
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.userService.logout();
    this.showDropdown = false;
    
    // Forcer la mise à jour de l'interface sans rafraîchir la page
    this.userService.notifyLoginStateChange();
  }

  // Méthode pour obtenir les initiales de l'utilisateur (si pas d'image)
  getUserInitials(): string {
    // Utiliser uniquement les données de la base de données
    if (this.client && this.client.nom) {
      // Si on a les informations client, utiliser le nom et prénom du client
      const nom = this.client.nom.charAt(0) || '';
      const prenom = this.client.prenom ? this.client.prenom.charAt(0) : '';
      return (nom + prenom).toUpperCase();
    } else if (this.user && this.user.nom) {
      // Sinon, utiliser le nom et prénom de l'utilisateur
      const nom = this.user.nom.charAt(0) || '';
      const prenom = this.user.prenom ? this.user.prenom.charAt(0) : '';
      return (nom + prenom).toUpperCase();
    }
    // Fallback si aucune information n'est disponible
    return '';
  }
}
