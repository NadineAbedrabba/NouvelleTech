import { Component, OnInit } from '@angular/core';

interface Review {
  id: number;
  restaurantName: string;
  date: Date;
  foodRating: number;
  serviceRating: number;
  ambianceRating: number;
  comment: string;
  tags: string[];
}

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent implements OnInit {
  // Données originales
  private originalReviews: Review[] = [
    {
      id: 1,
      restaurantName: "Le Gourmet Parisien",
      date: new Date('2023-05-15'),
      foodRating: 4.5,
      serviceRating: 5,
      ambianceRating: 4,
      comment: "Excellente cuisine française avec une touche moderne. Le service était impeccable.",
      tags: ["Gastronomique", "Romantique", "Vue"]
    },
    {
      id: 2,
      restaurantName: "Sakura Sushi Bar",
      date: new Date('2023-06-22'),
      foodRating: 5,
      serviceRating: 4,
      ambianceRating: 4.5,
      comment: "Les sushis les plus frais que j'ai jamais mangés. Ambiance zen et authentique.",
      tags: ["Japonais", "Poisson frais", "Omakase"]
    },
    {
      id: 3,
      restaurantName: "La Trattoria",
      date: new Date('2023-07-10'),
      foodRating: 3.5,
      serviceRating: 4,
      ambianceRating: 4,
      comment: "Pâtes faites maison délicieuses, cadre typiquement italien.",
      tags: ["Italien", "Familial", "Pâtes"]
    }
  ];

  // Données filtrées
  reviews: Review[] = [];

  // Filtres
  searchQuery: string = '';
  sortOption: string = 'date-desc';
  ratingFilter: string = 'all';
  selectedTags: string[] = [];

  ngOnInit(): void {
    this.reviews = [...this.originalReviews];
    this.applyFilters();
  }

  getOverallRating(review: Review): number {
    return (review.foodRating + review.serviceRating + review.ambianceRating) / 3;
  }

  get allTags(): string[] {
    const tags = new Set<string>();
    this.originalReviews.forEach(review => {
      review.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.originalReviews];
    
    // Filtre par recherche
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.restaurantName.toLowerCase().includes(query) || 
        review.comment.toLowerCase().includes(query)
      );
    }
    
    // Filtre par note
    if (this.ratingFilter !== 'all') {
      const minRating = parseInt(this.ratingFilter);
      filtered = filtered.filter(review => 
        this.getOverallRating(review) >= minRating
      );
    }
    
    // Filtre par tags
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter(review =>
        this.selectedTags.some(tag => review.tags.includes(tag))
      );
    }
    
    // Tri
    filtered.sort((a, b) => {
      switch (this.sortOption) {
        case 'date-asc': return a.date.getTime() - b.date.getTime();
        case 'date-desc': return b.date.getTime() - a.date.getTime();
        case 'rating-asc': return this.getOverallRating(a) - this.getOverallRating(b);
        case 'rating-desc': return this.getOverallRating(b) - this.getOverallRating(a);
        default: return 0;
      }
    });
    
    this.reviews = filtered;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.sortOption = 'date-desc';
    this.ratingFilter = 'all';
    this.selectedTags = [];
    this.applyFilters();
  }
}