import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, Client } from '../user-profile/user.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SettingsService } from '../services/settings.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SettingsComponent implements OnInit {
  client: Client | null = null;
  activeTab: string = 'preferences';
  
  // Paramètres de préférences
  preferences = {
    darkMode: false,
    cuisinePreferences: [] as string[]
  };

  // Paramètres de confidentialité
  privacy = {
    showReviews: true,
    publicProfile: true
  };



  availableCuisines = [
    'Française', 'Italienne', 'Japonaise', 'Mexicaine', 
    'Indienne', 'Chinoise', 'Tunisienne', 'Libanaise'
  ];

  // Messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private settingsService: SettingsService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Récupérer les informations du client connecté
    this.userService.currentClient$.subscribe(client => {
      this.client = client;
      if (client) {
        this.loadUserSettings();
      }
    });
    
    // S'abonner au changement de thème
    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.preferences.darkMode = isDarkMode;
    });
  }

  // Charger les paramètres utilisateur depuis le localStorage
  loadUserSettings(): void {
    if (!this.client) return;

    // Charger les préférences depuis le localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        this.preferences = { ...this.preferences, ...parsedPreferences };
      } catch (e) {
        console.error('Erreur lors du chargement des préférences:', e);
      }
    }

    // Charger les paramètres de confidentialité depuis le localStorage
    const savedPrivacy = localStorage.getItem('userPrivacy');
    if (savedPrivacy) {
      try {
        const parsedPrivacy = JSON.parse(savedPrivacy);
        this.privacy = { ...this.privacy, ...parsedPrivacy };
      } catch (e) {
        console.error('Erreur lors du chargement des paramètres de confidentialité:', e);
      }
    }

    console.log('Paramètres chargés depuis le localStorage');
  }

  // Sauvegarder les paramètres utilisateur
  saveSettings(settingType: 'preferences' | 'privacy'): void {
    if (!this.client) return;
    
    // Si nous sauvegardons les préférences, mettre à jour le mode sombre
    if (settingType === 'preferences') {
      // Appliquer immédiatement le mode sombre
      if (this.preferences.darkMode) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
      
      // Mettre à jour le service de thème
      this.themeService.setDarkMode(this.preferences.darkMode);
      
      // Sauvegarder les préférences dans le localStorage
      localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
      localStorage.setItem('darkMode', this.preferences.darkMode.toString());
      
      console.log('Mode sombre activé:', this.preferences.darkMode);
    } else {
      // Sauvegarder les paramètres de confidentialité dans le localStorage
      localStorage.setItem('userPrivacy', JSON.stringify(this.privacy));
    }
    
    // Afficher un message de succès
    this.successMessage = 'Paramètres enregistrés avec succès';
    setTimeout(() => this.successMessage = '', 3000);
    
    // Essayer de sauvegarder sur le serveur en arrière-plan (ne pas bloquer l'interface)
    try {
      const settingsToSave = settingType === 'preferences' ? this.preferences : this.privacy;
      this.settingsService.saveClientSettings(this.client.id, settingType, settingsToSave)
        .subscribe({
          next: () => console.log('Paramètres synchronisés avec le serveur'),
          error: (err) => console.error('Erreur lors de la synchronisation avec le serveur:', err)
        });
    } catch (e) {
      console.error('Erreur lors de la tentative de sauvegarde sur le serveur:', e);
    }
  }

  // Changer l'onglet actif
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Basculer une préférence de cuisine
  toggleCuisine(cuisine: string): void {
    if (this.preferences.cuisinePreferences.includes(cuisine)) {
      this.preferences.cuisinePreferences = this.preferences.cuisinePreferences.filter(c => c !== cuisine);
    } else {
      this.preferences.cuisinePreferences.push(cuisine);
    }
  }

  // Vérifier si une cuisine est sélectionnée
  isCuisineSelected(cuisine: string): boolean {
    return this.preferences.cuisinePreferences.includes(cuisine);
  }
  
  // Activer/désactiver le mode sombre immédiatement
  toggleDarkMode(): void {
    // Appliquer immédiatement le mode sombre
    if (this.preferences.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    // Sauvegarder la préférence dans le localStorage
    localStorage.setItem('darkMode', this.preferences.darkMode.toString());
    console.log('Mode sombre toggled:', this.preferences.darkMode);
    
    // Sauvegarder automatiquement les préférences
    this.saveSettings('preferences');
  }
}
