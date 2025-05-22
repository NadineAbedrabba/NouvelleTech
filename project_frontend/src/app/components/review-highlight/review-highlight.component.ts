import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-review-highlight',
  templateUrl: './review-highlight.component.html',
  styleUrls: ['./review-highlight.component.scss']
})
export class ReviewHighlightComponent implements AfterViewInit {
  today = new Date();
  
  featuredReviews = [
    {
      name: 'Marie D.',
      location: 'Lyon',
      rating: 5,
      text: 'J\'ai trouvé LE restaurant parfait pour mon anniversaire en 2 clics ! La plateforme est tellement intuitive.',
      avatar: 'assets/Images/P1.jpg'
    },
    {
      name: 'Pierre T.',
      location: 'Paris',
      rating: 4,
      text: 'Chaque jour une surprise différente, j\'adore cette diversité culinaire !',
      avatar: 'assets/Images/P2.jpg'
    },
    {
      name: 'Sophie R.',
      location: 'Marseille',
      rating: 5,
      text: 'L\'expérience est ludique et les suggestions sont toujours pertinentes. 10/10 !',
      avatar: 'assets/Images/P3.jpg'
    }
  ];

  ngAfterViewInit() {
    this.animateCards();
  }

  getStarsArray(rating: number): any[] {
    return Array(rating).fill(0);
  }

  getRandomCardColor(): string {
    const colors = [
      'rgba(255, 107, 157, 0.1)',
      'rgba(58, 123, 213, 0.1)',
      'rgba(255, 198, 0, 0.1)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animateCards() {
    const cards = document.querySelectorAll('.review-card');
    cards.forEach((card: Element) => {
      const htmlCard = card as HTMLElement;
      const delay = htmlCard.style.getPropertyValue('--delay') || '0ms';
      htmlCard.style.setProperty('--animate-duration', '0.6s');
      htmlCard.style.setProperty('--animate-delay', delay);
      htmlCard.classList.add('animate__animated', 'animate__fadeInUp');
    });
  }
}