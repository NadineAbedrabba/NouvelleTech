import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSectionComponent } from '../components/hero-section/hero-section.component';
import { AppFeaturesComponent } from '../components/app-features/app-features.component';
import { CreativeSplitComponent } from '../components/creative-split/creative-split.component';
import { RestaurantCategoriesComponent } from '../components/restaurant-categories/restaurant-categories.component';
import { DailyDiscoveryComponent } from '../components/daily-discovery/daily-discovery.component';
import { ReviewHighlightComponent } from '../components/review-highlight/review-highlight.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeroSectionComponent,
    AppFeaturesComponent,
    CreativeSplitComponent,
    RestaurantCategoriesComponent,
    DailyDiscoveryComponent,
    ReviewHighlightComponent
  ]
})
export class HomeComponent {

}
