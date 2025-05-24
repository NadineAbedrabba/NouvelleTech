import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AppFeaturesComponent } from './components/app-features/app-features.component';
import { RestaurantCategoriesComponent } from './components/restaurant-categories/restaurant-categories.component';
import { DailyDiscoveryComponent } from './components/daily-discovery/daily-discovery.component';
import { CreativeSplitComponent } from './components/creative-split/creative-split.component';
import { SectionTransitionComponent } from './components/section-transition/section-transition.component';
import { ReviewHighlightComponent } from './components/review-highlight/review-highlight.component';
import { ReviewContainerComponent } from './review-container/review-container.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';
import { RatingStarsComponent } from './rating-stars/rating-stars.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HeroSectionComponent,
    AppFeaturesComponent,
    RestaurantCategoriesComponent,
    DailyDiscoveryComponent,
    CreativeSplitComponent,
    SectionTransitionComponent,
    ReviewHighlightComponent,
    ReviewContainerComponent,
    MyReviewsComponent,
    RatingStarsComponent,
    FavoritesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
