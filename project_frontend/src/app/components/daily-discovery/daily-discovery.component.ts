import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-discovery',
  templateUrl: './daily-discovery.component.html',
  styleUrls: ['./daily-discovery.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('revealAnimation', [
      state('hidden', style({
        opacity: 0,
        height: '0',
        margin: '0',
        padding: '0'
      })),
      state('visible', style({
        opacity: 1,
        height: '*',
        margin: '*',
        padding: '*'
      })),
      transition('hidden => visible', [
        animate('0.5s ease-out')
      ]),
      transition('visible => hidden', [
        animate('0.3s ease-in')
      ])
    ]),
    trigger('pulseBadge', [
      state('normal', style({
        transform: 'rotate(-5deg) scale(1)'
      })),
      state('pulse', style({
        transform: 'rotate(-5deg) scale(1.1)'
      })),
      transition('normal <=> pulse', [
        animate('1s ease-in-out')
      ])
    ])
  ]
})
export class DailyDiscoveryComponent implements OnInit {
  // Références aux éléments du DOM
  @ViewChild('discoveryCard') discoveryCard!: ElementRef;
  
  // États pour les animations
  isRevealed = false;
  badgeState = 'normal';
  
  // Données dynamiques (peuvent venir d'un service)
  todaysRecommendation = {
    name: 'Le Cachotier',
    rating: 4.7,
    reviewCount: 128,
    description: 'Restaurant clandestin spécialisé en cuisine fusion franco-japonaise. Le chef Hideki propose un menu improvisé selon le marché du jour.',
    tags: ['#Surprise', '#Omakase', '#AdresseSecrète'],
    image: 'assets/Images/mystery-dish.jpg'
  };

  constructor() { }

  ngOnInit(): void {
    // Animation pulsée du badge en boucle
    setInterval(() => {
      this.badgeState = this.badgeState === 'normal' ? 'pulse' : 'normal';
    }, 2000);
  }

  // Révélation de la surprise
  revealSurprise(): void {
  // Bascule l'état
  this.isRevealed = !this.isRevealed;

  console.log(`Bouton "${this.isRevealed ? 'Cacher' : 'Révéler'} la surprise" appuyé`);

  // Animation physique de la carte
  const card = this.discoveryCard?.nativeElement;
  if (card) {
    const animationFrames = [
      { transform: 'rotate(0deg) translateY(0)' },
      { transform: 'rotate(2deg) translateY(-5px)' },
      { transform: 'rotate(-2deg) translateY(5px)' },
      { transform: 'rotate(0deg) translateY(0)' }
    ];
    
    card.animate(animationFrames, {
      duration: 500,
      easing: 'ease-in-out'
    });
  }

  // Simule un chargement de données uniquement quand on révèle
  if (this.isRevealed) {
    setTimeout(() => {
      console.log('Données du restaurant chargées');
      // Ici tu peux appeler ton service si besoin
    }, 300);
  }
}


  // Réinitialiser la découverte
  resetDiscovery(): void {
    this.isRevealed = false;
  }

  // Générer une nouvelle recommandation (simulé)
  generateNewRecommendation(): void {
    this.isRevealed = false;
    
    // Simulation de changement de données
    setTimeout(() => {
      // En réalité, vous appelleriez un service backend
      this.todaysRecommendation = {
        name: 'Nouveau Mystère',
        rating: 4.5,
        reviewCount: 92,
        description: 'Nouvelle description surprise générée aléatoirement.',
        tags: ['#Nouveauté', '#TestéChef'],
        image: 'assets/images/mystery-dish.jpg'
      };
    }, 500);
  }
  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
  
    if (hasHalfStar) {
      stars.push('half');
    }
  
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('empty');
    }
  
    return stars;
  }
  getStarClass(star: string): string[] {
    if (star === 'full') return ['fas', 'fa-star'];
    if (star === 'half') return ['fas', 'fa-star-half-alt'];
    if (star === 'empty') return ['far', 'fa-star'];
    return [];
  }
}
