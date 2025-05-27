import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { UserService } from '../../../user-profile/user.service';
import { LoginSuccessService } from '../../../user-profile/login-success.service';

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css'],
  standalone:true,
  imports:[ ReactiveFormsModule, CommonModule]
})
export class LoginUserComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  @Output() closeModal = new EventEmitter<void>();
  @Output() loginSubmitted = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private userService: UserService,
    private loginSuccessService: LoginSuccessService
  ) {}
  
  // Méthode pour récupérer les informations client par l'ID utilisateur
  // Utilisée comme solution de secours si la récupération par email échoue
  private tryGetClientInfoByUserId(userId: number | null, user: any): void {
    if (!userId) {
      console.warn('Impossible de récupérer les informations client: ID utilisateur non défini');
      return;
    }
    
    console.log('Récupération des informations client pour l\'utilisateur ID:', userId);
    this.authService.getClientInfo(userId).subscribe({
      next: (clientData) => {
        console.log('Informations client récupérées:', clientData);
        
        // Extraire les données client de la réponse, qui peut avoir différentes structures
        let clientInfo = clientData;
        if (clientData && typeof clientData === 'object') {
          if (clientData.data) clientInfo = clientData.data;
          else if (clientData.client) clientInfo = clientData.client;
          else if (clientData.content) clientInfo = clientData.content;
        }
        
        if (clientInfo && clientInfo.id) {
          console.log('ID client récupéré:', clientInfo.id);
          // Mettre à jour les informations client dans le service
          this.userService.setCurrentClient({
            id: clientInfo.id,
            userId: userId,
            nom: clientInfo.nom || user.nom || '',
            prenom: clientInfo.prenom || '',
            imageUrl: clientInfo.imageUrl
          });
        } else {
          console.warn('Aucun ID client trouvé dans la réponse. Création d\'un client par défaut.');
          // Créer un client par défaut avec un ID fixe pour le développement
          this.createDefaultClient(userId, user);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des informations client:', err);
        // En cas d'erreur, créer un client par défaut
        this.createDefaultClient(userId, user);
      }
    });
  }
  
  // Méthode pour créer un client par défaut en cas d'erreur
  private createDefaultClient(userId: number, user: any): void {
    console.log('Création d\'un client par défaut pour l\'utilisateur ID:', userId);
    const defaultClient = {
      id: 1, // ID par défaut pour le développement
      userId: userId,
      nom: user.nom || 'Utilisateur',
      prenom: '',
      imageUrl: undefined
    };
    console.log('Client par défaut créé:', defaultClient);
    this.userService.setCurrentClient(defaultClient);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('User login data:', this.loginForm.value);
      
      // Émettre l'événement pour permettre au composant parent de gérer la soumission
      this.loginSubmitted.emit(this.loginForm.value);
      
      this.authService.authenticate(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log('Login réussie - Réponse complète:', response);
          
          // Analyser la structure de la réponse pour débugger
          if (response) {
            console.log('Type de réponse:', typeof response);
            console.log('Propriétés de la réponse:', Object.keys(response));
          }
          
          // Stocker le token dans le localStorage si présent
          let jwtToken = '';
          if (response.token) {
            jwtToken = response.token;
            localStorage.setItem('authToken', jwtToken);
          } else if (response.jwtToken) {
            jwtToken = response.jwtToken;
            localStorage.setItem('authToken', jwtToken);
          }
          
          // Explorer la structure complète de la réponse
          console.log('Structure complète de la réponse:', JSON.stringify(response, null, 2));
          
          // Décoder le token JWT pour extraire les informations utilisateur
          let userEmail = '';
          let userId: number | null = null;
          
          // Essayer d'extraire l'ID utilisateur directement de la réponse
          if (response.userId) {
            userId = response.userId;
            console.log('ID utilisateur extrait de la réponse:', userId);
          } else if (response.user && response.user.id) {
            userId = response.user.id;
            console.log('ID utilisateur extrait de user.id dans la réponse:', userId);
          }
          
          // Si on n'a pas trouvé l'ID dans la réponse, essayer de le décoder du token JWT
          if (!userId && jwtToken) {
            const decodedToken = this.authService.decodeToken(jwtToken);
            console.log('Token JWT décodé:', decodedToken);
            
            // Extraire l'email et l'ID du token décodé
            if (decodedToken) {
              userEmail = decodedToken.sub || decodedToken.email || '';
              userId = decodedToken.id || decodedToken.userId || decodedToken.user_id || null;
              console.log('Email extrait du token:', userEmail);
              console.log('ID utilisateur extrait du token:', userId);
            }
          }
          
          // Si nous n'avons pas d'email dans le token, utiliser celui du formulaire
          if (!userEmail && this.loginForm.value.email) {
            userEmail = this.loginForm.value.email;
          }
          
          // Vérifier si l'ID utilisateur est valide (différent de 0 ou null)
          if (!userId || userId === 0) {
            console.error('Impossible de récupérer un ID utilisateur valide. Utilisation d\'un ID temporaire pour le développement.');
            // Pour le développement uniquement, utiliser un ID fixe si aucun ID n'est trouvé
            // En production, il faudrait gérer cette erreur différemment
            userId = 1; // ID temporaire pour le développement
          }
          
          // Créer un objet utilisateur avec les informations disponibles
          const user = {
            id: userId,
            email: userEmail,
            nom: '',
            prenom: ''
          };
          
          // Essayer d'extraire le nom d'utilisateur de l'email
          if (userEmail && !user.nom) {
            // Extraire le nom d'utilisateur de l'email (avant le @)
            const emailParts = userEmail.split('@');
            if (emailParts.length > 0) {
              // Nettoyer le nom d'utilisateur (enlever les caractères spéciaux)
              let username = emailParts[0].replace(/[^a-zA-Z0-9]/g, '');
              // Mettre la première lettre en majuscule
              if (username) {
                username = username.charAt(0).toUpperCase() + username.slice(1);
                user.nom = username;
              }
            }
          }
          
          // Stocker les informations de l'utilisateur
          this.userService.setCurrentUser(user);
          
          // Récupérer l'ID du client directement par email (plus fiable)
          if (userEmail) {
            console.log('Tentative de récupération de l\'ID client par email:', userEmail);
            
            // Utiliser la nouvelle méthode pour récupérer l'ID client par email
            this.authService.getClientIdByEmail(userEmail).subscribe({
              next: (response) => {
                console.log('Réponse de getClientIdByEmail:', response);
                
                // Extraire l'ID client de la réponse, qui peut avoir différentes structures
                let clientId: number | null = null;
                let clientInfo = response;
                
                // Traiter différentes structures de réponse possibles
                if (response && typeof response === 'object') {
                  if (response.id) {
                    clientId = response.id;
                  } else if (response.clientId) {
                    clientId = response.clientId;
                  } else if (response.data && response.data.id) {
                    clientId = response.data.id;
                  } else if (response.client && response.client.id) {
                    clientId = response.client.id;
                  }
                  
                  // Extraire les informations client complètes si disponibles
                  if (response.data) clientInfo = response.data;
                  else if (response.client) clientInfo = response.client;
                  else if (response.content) clientInfo = response.content;
                }
                
                if (clientId) {
                  console.log('ID client récupéré par email:', clientId);
                  // Mettre à jour les informations client dans le service
                  this.userService.setCurrentClient({
                    id: clientId,
                    userId: userId || 0,
                    nom: (clientInfo && clientInfo.nom) || user.nom || '',
                    prenom: (clientInfo && clientInfo.prenom) || '',
                    imageUrl: (clientInfo && clientInfo.imageUrl) || undefined
                  });
                } else {
                  console.warn('Aucun ID client trouvé dans la réponse. Tentative avec getClientInfo...');
                  // Si nous n'avons pas pu récupérer l'ID client par email, essayer avec l'ID utilisateur
                  this.tryGetClientInfoByUserId(userId, user);
                }
              },
              error: (err) => {
                console.error('Erreur lors de la récupération de l\'ID client par email:', err);
                // En cas d'erreur, essayer avec l'ID utilisateur
                this.tryGetClientInfoByUserId(userId, user);
              }
            });
          } else if (userId) {
            // Si nous n'avons pas d'email, essayer avec l'ID utilisateur
            this.tryGetClientInfoByUserId(userId, user);
          }
          
          // Afficher un message de bienvenue avec le nom disponible
          const displayName = user.nom || 'Utilisateur';
          console.log('Nom pour le message de bienvenue:', displayName);
          this.loginSuccessService.showWelcomeMessage(`Bienvenue, ${displayName}!`);
          
          // Fermer le modal
          this.closeModal.emit();
          
          // Forcer la mise à jour de l'interface
          setTimeout(() => this.userService.notifyLoginStateChange(), 100);
        },
        error: (err: any) => {
          console.error('Erreur lors du login:', err);
        }
      });
    }
  }
}
