import { BrowserModule } from "@angular/platform-browser";
import { AppFeaturesComponent } from "./components/app-features/app-features.component";
import { CreativeSplitComponent } from "./components/creative-split/creative-split.component";
import { DailyDiscoveryComponent } from "./components/daily-discovery/daily-discovery.component";
import { HeroSectionComponent } from "./components/hero-section/hero-section.component";
import { RestaurantCategoriesComponent } from "./components/restaurant-categories/restaurant-categories.component";
import { ReviewHighlightComponent } from "./components/review-highlight/review-highlight.component";
import { SectionTransitionComponent } from "./components/section-transition/section-transition.component";
import { FavoritesComponent } from "./favorites/favorites.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { RatingStarsComponent } from "./rating-stars/rating-stars.component";
import { ReviewContainerComponent } from "./review-container/review-container.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MyReviewsComponent } from "./reviews/my-reviews/my-reviews.component";
import { UserProfileModule } from "./user-profile/user-profile.module";
import { AuthModule } from "./auth/auth.module";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { NgModule } from "@angular/core";

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
    RatingStarsComponent,
    FavoritesComponent,
    MyReviewsComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthModule,
    UserProfileModule,
    BrowserModule,
    CommonModule,
    RouterModule.forRoot([]),
    AuthModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
