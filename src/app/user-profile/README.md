# Module de Profil Utilisateur

Ce module permet de gérer l'authentification des utilisateurs et d'afficher leur profil dans le header de l'application.

## Fonctionnalités

- Connexion utilisateur avec affichage d'un message de bienvenue
- Affichage du profil utilisateur dans le header
- Menu déroulant avec options utilisateur
- Gestion de session utilisateur (stockage local)
- Intercepteur HTTP pour ajouter le token d'authentification aux requêtes

## Comment intégrer ce module

### 1. Importer le module dans app.module.ts

```typescript
import { UserProfileModule } from './user-profile/user-profile.module';

@NgModule({
  imports: [
    // autres imports...
    UserProfileModule
  ],
})
export class AppModule { }
```

### 2. Ajouter le composant de profil dans le header

Dans `header.component.html`, remplacer le bouton de connexion par le composant de profil utilisateur :

```html
<!-- Remplacer ceci -->
<button class="nav-item btn-signup" (click)="openAuthModal()">
  <i class="fas fa-user-plus"></i>
  <span>Connexion</span>
</button>

<!-- Par ceci -->
<app-user-profile></app-user-profile>
```

### 3. Ajouter le composant de toast pour les messages de bienvenue

Dans `app.component.html`, ajouter le composant de toast :

```html
<!-- Ajouter ceci à la fin du fichier -->
<app-welcome-toast></app-welcome-toast>
```

### 4. Modifier le modal d'authentification

Dans le modal d'authentification, utiliser le composant de connexion amélioré :

```html
<!-- Remplacer ceci -->
<app-login-user *ngIf="activeTab === 'user' && activeForm === 'login'" (switchToSignup)="switchForm('signup')"></app-login-user>

<!-- Par ceci -->
<app-enhanced-login-user *ngIf="activeTab === 'user' && activeForm === 'login'" (switchToSignup)="switchForm('signup')" (closeModal)="onClose()"></app-enhanced-login-user>
```

## Configuration de l'environnement

Assurez-vous que le fichier `environment.ts` contient la variable `apiBaseUrl` pointant vers votre API backend :

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

## Structure des API backend requises

Le module s'attend à ce que le backend fournisse les endpoints suivants :

1. **POST /api/authenticate** - Pour authentifier un utilisateur
   - Corps de la requête : `{ email: string, password: string }`
   - Réponse attendue : `{ token: string, user: { id: number, email: string, nom: string, prenom?: string } }`

2. **GET /api/client/by-user/{userId}** - Pour récupérer les informations du client associé à un utilisateur
   - Réponse attendue : `{ id: number, userId: number, nom: string, prenom: string, imageUrl?: string }`

## Personnalisation

Vous pouvez personnaliser l'apparence des composants en modifiant les fichiers SCSS correspondants.
