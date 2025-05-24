import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeroSectionComponent {

}
