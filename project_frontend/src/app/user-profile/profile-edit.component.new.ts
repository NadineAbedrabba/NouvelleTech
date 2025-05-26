import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, Client, Image } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { finalize, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-edit/profile-edit.component.html',
  styleUrls: ['./profile-edit/profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  @ViewChild('imageInput') imageInput!: ElementRef;
  
  client: Client | null = null;
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  
  // Modèle pour l'édition
  editModel: any = {
    nom: '',
    email: '',
    imageUrl: ''
  };
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Vérifier si l'utilisateur est connecté en utilisant le token d'authentification
    const token = localStorage.getItem('authToken');
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    console.log('Informations disponibles:', { token, userEmail, userId });
    
    if (!token) {
      this.errorMessage = 'Vous devez être connecté pour accéder à cette page';
      this.isLoading = false;
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
      return;
    }
    
    // Essayer de récupérer l'ID utilisateur depuis le token JWT
    try {
      const tokenData = this.authService.decodeToken(token);
      if (tokenData && tokenData.sub) {
        console.log('ID utilisateur récupéré du token:', tokenData.sub);
        // Si l'ID utilisateur est un email, on le stocke pour l'utiliser plus tard
        if (tokenData.sub.includes('@')) {
          localStorage.setItem('userEmail', tokenData.sub);
          this.loadClientByEmail(tokenData.sub);
          return;
        } else {
          // Si c'est un ID numérique, on l'utilise directement
          localStorage.setItem('userId', tokenData.sub);
          this.loadClientByUserId(tokenData.sub);
          return;
        }
      }
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
    }
    
    // Si nous avons un email utilisateur, essayons de récupérer l'ID client par email
    if (userEmail) {
      this.loadClientByEmail(userEmail);
      return;
    }
    
    // Si nous avons un ID utilisateur, utilisons-le pour récupérer les informations du client
    if (userId) {
      this.loadClientByUserId(userId);
      return;
    }
    
    // Dernier recours : essayer de récupérer l'utilisateur actuel
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.loadClientByUserId(currentUser.id.toString());
    } else {
      this.errorMessage = 'Impossible de récupérer vos informations. Veuillez vous reconnecter.';
      this.isLoading = false;
    }
  }
  
  // Méthode pour charger le client par email
  private loadClientByEmail(email: string): void {
    console.log('Chargement du client par email:', email);
    this.authService.getClientIdByEmail(email)
      .pipe(finalize(() => {
        if (!this.client) {
          this.isLoading = false;
        }
      }))
      .subscribe({
        next: (response) => {
          console.log('Réponse de getClientIdByEmail:', response);
          
          // Extraire l'ID client de la réponse
          let clientId: number | null = null;
          if (response && typeof response === 'object') {
            if (response.id) clientId = response.id;
            else if (response.clientId) clientId = response.clientId;
          }
          
          if (clientId) {
            console.log('ID client récupéré par email:', clientId);
            localStorage.setItem('clientId', clientId.toString());
            
            // Maintenant que nous avons l'ID client, récupérer les informations complètes
            this.loadClientById(clientId);
          } else {
            this.errorMessage = 'Impossible de récupérer l\'ID client pour cet email.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération de l\'ID client par email:', error);
          this.errorMessage = 'Impossible de récupérer vos informations. Veuillez vous reconnecter.';
          this.isLoading = false;
        }
      });
  }
  
  // Méthode pour charger le client par ID
  private loadClientById(clientId: number): void {
    console.log('Chargement du client par ID:', clientId);
    
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer un objet HttpHeaders pour les en-têtes
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    this.http.get<any>(`${environment.apiBaseUrl}/review/client/${clientId}`, httpOptions)
      .pipe(
        finalize(() => {
          if (!this.client) {
            this.isLoading = false;
          }
        }),
        catchError((error) => {
          console.error('Erreur lors de la récupération du client par ID:', error);
          this.errorMessage = 'Impossible de récupérer vos informations. Veuillez vous reconnecter.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.handleClientData(response);
            this.isLoading = false;
          }
        }
      });
  }
  
  // Méthode pour charger le client par ID utilisateur
  private loadClientByUserId(userId: string): void {
    console.log('Chargement du client par ID utilisateur:', userId);
    
    // Si nous avons un ID client dans le localStorage, l'utiliser directement
    const clientId = localStorage.getItem('clientId');
    if (clientId) {
      console.log('Utilisation de l\'ID client du localStorage:', clientId);
      this.loadClientById(Number(clientId));
      return;
    }
    
    // Si nous n'avons pas d'ID client, essayer de récupérer l'email depuis le token
    const token = localStorage.getItem('authToken');
    try {
      const tokenData = this.authService.decodeToken(token || '');
      if (tokenData && tokenData.sub && tokenData.sub.includes('@')) {
        console.log('Email récupéré du token:', tokenData.sub);
        this.loadClientByEmail(tokenData.sub);
        return;
      }
    } catch (e) {
      console.error('Erreur lors du décodage du token:', e);
    }
    
    // Essayer de récupérer l'email depuis localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      console.log('Email récupéré du localStorage:', userEmail);
      this.loadClientByEmail(userEmail);
      return;
    }
    
    // Si aucune autre méthode ne fonctionne, afficher un message d'erreur
    this.errorMessage = 'Impossible de récupérer vos informations. Veuillez vous reconnecter.';
    this.isLoading = false;
  }
  
  // Méthode pour gérer les données du client récupérées
  private handleClientData(client: Client): void {
    this.client = client;
    // Initialiser le modèle d'édition avec les données du client
    if (client) {
      this.editModel = {
        nom: client.nom || '',
        email: client.email || '',
        // Gérer l'image du client
        imageUrl: client.image?.url || client.imageUrl || ''
      };
      this.errorMessage = '';
      
      // Stocker l'ID client dans localStorage pour les futures utilisations
      if (client.id) {
        localStorage.setItem('clientId', client.id.toString());
      }
      
      // Stocker l'ID de l'image si disponible
      if (client.image && client.image.id) {
        localStorage.setItem('clientImageId', client.image.id.toString());
      }
    } else {
      this.errorMessage = 'Aucune information client trouvée. Veuillez compléter votre profil.';
    }
  }
  
  // Méthode pour gérer les erreurs
  private handleError(error: any): void {
    console.error('Erreur lors du chargement du profil:', error);
    this.errorMessage = 'Impossible de charger votre profil. Veuillez réessayer plus tard.';
  }
  
  saveProfile(): void {
    if (!this.client) {
      this.errorMessage = 'Impossible de mettre à jour le profil: aucun client trouvé';
      return;
    }
    
    // Vérifier que l'ID du client est valide
    if (!this.client.id || this.client.id === 0) {
      console.error('ID client invalide:', this.client.id);
      this.errorMessage = 'Impossible de mettre à jour le profil: ID client invalide';
      
      // Essayer de récupérer l'ID utilisateur depuis le token
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const tokenData = this.authService.decodeToken(token);
          if (tokenData && tokenData.sub) {
            console.log('ID utilisateur récupéré du token:', tokenData.sub);
            localStorage.setItem('userId', tokenData.sub);
            this.loadUserProfile(); // Recharger le profil
            return;
          }
        } catch (e) {
          console.error('Erreur lors du décodage du token:', e);
        }
      }
      
      // Essayer de récupérer l'ID depuis localStorage
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Tentative de récupération du client avec userId:', userId);
        this.loadUserProfile(); // Recharger le profil
        return;
      }
      return;
    }
    
    // Créer un objet pour stocker uniquement les champs modifiés
    const updatedFields: Partial<Client> = {};
    
    // Vérifier chaque champ et ne l'ajouter que s'il a été modifié
    if (this.editModel.nom !== undefined && this.editModel.nom !== null) {
      updatedFields.nom = this.editModel.nom;
    }
    
    if (this.editModel.email !== undefined && this.editModel.email !== null) {
      updatedFields.email = this.editModel.email;
    }
    
    // Gérer l'image du client si elle a été modifiée
    if (this.editModel.imageUrl && this.client && this.editModel.imageUrl !== (this.client.image?.url || this.client.imageUrl)) {
      // Si le client a déjà une image, mettre à jour son URL
      if (this.client.image) {
        updatedFields.image = {
          ...this.client.image,
          url: this.editModel.imageUrl
        };
      } else {
        // Sinon, créer une nouvelle image
        const imageId = localStorage.getItem('clientImageId');
        updatedFields.image = {
          id: imageId ? Number(imageId) : 0,
          url: this.editModel.imageUrl,
          name: `profile_${this.client.id}`
        };
      }
    }
    
    // Créer le client mis à jour en combinant le client existant avec les champs modifiés
    const updatedClient: Client = {
      ...this.client,
      ...updatedFields
    };
    
    console.log('Mise à jour du client avec ID:', updatedClient.id);
  
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('authToken');
    
    // Créer un objet HttpHeaders pour les en-têtes
    const httpOptions = {
      headers: token ? new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }) : new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  
    // Utiliser l'URL correcte avec le préfixe /review/client
    this.http.put<any>(`${environment.apiBaseUrl}/review/client/${updatedClient.id}`, updatedClient, httpOptions).subscribe({
      next: (response) => {
        this.client = response;
        this.successMessage = 'Profil mis à jour avec succès';
        // Mettre à jour les informations dans le localStorage si nécessaire
        if (response.email) {
          localStorage.setItem('userEmail', response.email);
        }
        
        // Stocker l'ID de l'image si disponible
        if (response.image && response.image.id) {
          localStorage.setItem('clientImageId', response.image.id.toString());
        }
        
        // Mettre à jour le modèle d'édition avec les nouvelles données
        this.handleClientData(response);
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
        this.errorMessage = 'Impossible de mettre à jour votre profil. Veuillez réessayer plus tard.';
        // Masquer le message d'erreur après 3 secondes
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }
  
  cancel(): void {
    // Rediriger vers la page d'accueil ou la page précédente
    this.router.navigate(['/']);
  }
  
  // Méthode pour ouvrir le sélecteur de fichier
  openImageUpload(): void {
    this.imageInput.nativeElement.click();
  }
  
  // Méthode appelée lorsqu'une image est sélectionnée
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Vérifier que le fichier est une image
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Veuillez sélectionner une image valide.';
        return;
      }
      
      // Vérifier la taille de l'image (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'L\'image est trop volumineuse. Taille maximale: 5MB.';
        return;
      }
      
      // Lire le fichier et le convertir en Data URL
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          // Mettre à jour le modèle avec la nouvelle URL de l'image
          this.editModel.imageUrl = e.target.result as string;
          
          // Afficher un message de succès
          this.successMessage = 'Image téléchargée avec succès. N\'oubliez pas d\'enregistrer votre profil.';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  }
  
  // Méthode pour télécharger l'image vers le serveur
  uploadImage(imageData: string): Promise<Image> {
    return new Promise((resolve, reject) => {
      // Récupérer le token JWT du localStorage
      const token = localStorage.getItem('authToken');
      
      // Créer un objet HttpHeaders pour les en-têtes
      const httpOptions = {
        headers: token ? new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }) : new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      
      // Préparer les données de l'image
      const imagePayload = {
        data: imageData,
        name: `profile_${this.client?.id || 'new'}_${Date.now()}`
      };
      
      // Envoyer la requête au serveur
      this.http.post<any>(`${environment.apiBaseUrl}/review/images/upload`, imagePayload, httpOptions)
        .subscribe({
          next: (response) => {
            console.log('Image téléchargée avec succès:', response);
            resolve(response);
          },
          error: (error) => {
            console.error('Erreur lors du téléchargement de l\'image:', error);
            reject(error);
          }
        });
    });
  }
}
