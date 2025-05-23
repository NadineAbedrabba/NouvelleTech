import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  templateUrl: './rating-stars.component.html',
  styleUrls: ['./rating-stars.component.scss']
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  
  get fullStars(): number {
    return Math.floor(this.rating);
  }
  
  get hasHalfStar(): boolean {
    return this.rating % 1 >= 0.5;
  }
  
  get emptyStars(): number {
    return 5 - this.fullStars - (this.hasHalfStar ? 1 : 0);
  }
}
