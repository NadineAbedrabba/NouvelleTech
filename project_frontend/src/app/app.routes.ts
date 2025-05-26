import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ReviewsComponent } from './admin/components/reviews/reviews.component';
import { RestaurantsComponent } from './admin/components/restaurants-page/restaurants.component';
import { RestaurantRequestsComponent } from './admin/components/restaurant-requests/restaurant-requests.component';
import { RestaurantDetailsComponent } from './admin/components/restaurant-details/restaurant-details.component';
import { RestaurantPendingComponent } from './admin/components/restaurant-pending copy/restaurant-pending.component';
import { RestaurantProfileComponent } from './entreprise/components/profil-entreprise/profil-entreprise.component';
import { ReservationsComponent } from './entreprise/components/resevations/resevations.component';
import { ReservationDetailsComponent } from './entreprise/components/reservation-details/reservation-details.component';
import { HomeComponent } from './home/home.component';
import { ReviewContainerComponent } from './review-container/review-container.component';
import { MyReviewsComponent } from './reviews/my-reviews/my-reviews.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ProfileEditComponent } from './user-profile/profile-edit/profile-edit.component';
import { AuthGuard } from './auth/auth.guard';
import { RestaurantPageComponent } from './features/place-page/restaurant/restaurant-page/restaurant-page.component';
import { ItalianRestaurantPageComponent } from './features/categories-pages/restaurants/italian-restaurant/italian-restaurant-page/italian-restaurant-page.component';
import { RestaurantsPageComponent } from './features/list-places/restaurants-list/restaurants-page/restaurants-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'restos', component: RestaurantRequestsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'pages', component: RestaurantsComponent },
  { path: 'restaurant/:id', component: RestaurantDetailsComponent },
  { path: 'restaurantsPending/:id', component: RestaurantPendingComponent },
  { path: 'reviews/:id', component: ReviewsComponent },
  { path: 'profil', component: RestaurantProfileComponent },
  { path: 'profile', component: ProfileEditComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'reservations/:id', component: ReservationDetailsComponent },
  { path: 'review', component: ReviewContainerComponent },
  { path: 'review/:id', component: ReviewContainerComponent },
  { 
    path: 'my-reviews', 
    component: MyReviewsComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'favorites', component: FavoritesComponent },

    { path: 'restaurants/:id', component: RestaurantsPageComponent },
    { path: 'restaurants', component: RestaurantsPageComponent },
    { path: 'restaurant', component: RestaurantPageComponent },
    { path: 'italian-restaurant', component: ItalianRestaurantPageComponent},
];