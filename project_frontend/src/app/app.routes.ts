import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { ReviewsComponent } from './admin/components/reviews/reviews.component';
import { RestaurantsPageComponent } from './admin/components/restaurants-page/restaurantsPage.component';
import { RestaurantRequestsComponent } from './admin/components/restaurant-requests/restaurant-requests.component';
import { RestaurantDetailsComponent } from './admin/components/restaurant-details/restaurant-details.component';
import { RestaurantPendingComponent } from './admin/components/restaurant-pending copy/restaurant-pending.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'restaurants', component: RestaurantRequestsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'pages', component: RestaurantsPageComponent },
  { path: 'restaurants/:matricule',  // Assurez-vous que c'est bien ':matricule'
    component: RestaurantDetailsComponent },

    { path: 'restaurantsPending/:matricule',  // Assurez-vous que c'est bien ':matricule'
      component: RestaurantPendingComponent },
  { path: '', redirectTo: '/restaurants', pathMatch: 'full' },
  { path: 'reviews/:id', component: ReviewsComponent },
];