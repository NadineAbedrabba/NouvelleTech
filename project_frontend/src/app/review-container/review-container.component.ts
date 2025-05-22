import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-review',
  templateUrl: './review-container.component.html',
  styleUrls: ['./review-container.component.scss']
})
export class ReviewContainerComponent {
  reviewText: string = '';
  ratingCategories = [
    { label: 'Nourriture', rating: 0, icon: '🍽️' },
    { label: 'Service', rating: 0, icon: '💁' },
    { label: 'Ambiance', rating: 0, icon: '🎶' }
  ];
  companion: string = '';
  occasion: string = '';
  isCertified: boolean = false;
  isSubmitting: boolean = false;

  get overallRating(): number {
    const ratings = this.ratingCategories.map(c => c.rating).filter(r => r > 0);
    return ratings.length > 0 ? 
      ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }

  isFormValid(): boolean {
    return this.reviewText.trim().length > 0 && 
           this.ratingCategories.every(c => c.rating > 0) && 
           this.companion !== '' &&  // Explicit check for non-empty string
           this.occasion !== '' &&   // Explicit check for non-empty string
           this.isCertified === true; // Explicit boolean check
  }

  submitReview() {
    if (this.isFormValid()) {
      this.isSubmitting = true;
      
      // Simuler un appel API
      setTimeout(() => {
        const review = {
          text: this.reviewText,
          ratings: this.ratingCategories.reduce((acc, curr) => {
            acc[curr.label.toLowerCase()] = curr.rating;
            return acc;
          }, {} as any),
          overall: this.overallRating,
          companion: this.companion,
          occasion: this.occasion,
          date: new Date()
        };
        
        console.log('Review submitted:', review);
        this.isSubmitting = false;
        this.resetForm();
        
        // Ici vous pourriez ajouter une notification de succès
      }, 1500);
    }
  }

  resetForm() {
    this.reviewText = '';
    this.ratingCategories.forEach(c => c.rating = 0);
    this.companion = '';
    this.occasion = '';
    this.isCertified = false;
  }
}
