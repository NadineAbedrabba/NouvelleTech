import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
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
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
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
    ReviewContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AuthModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
