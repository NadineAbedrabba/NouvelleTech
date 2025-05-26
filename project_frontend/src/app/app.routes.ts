import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/components/dashboard/dashboard.component';
import { AdminReviewsComponent } from './admin/components/reviews/reviews.component';
import { RestaurantsPageComponent } from './admin/components/restaurants-page/restaurantsPage.component';
import { RestaurantRequestsComponent } from './admin/components/restaurant-requests/restaurant-requests.component';
import { RestaurantDetailsComponent } from './admin/components/restaurant-details/restaurant-details.component';
import { RestaurantPendingComponent } from './admin/components/restaurant-pending copy/restaurant-pending.component';
import { RestaurantProfileComponent } from './entreprise/components/profil-entreprise/profil-entreprise.component';
import { ReservationsComponent } from './entreprise/components/resevations/resevations.component';
import { ReservationDetailsComponent } from './entreprise/components/reservation-details/reservation-details.component';
import { EntrepriseDashboardComponent } from './entreprise/components/entreprise-dashboard/entreprise-dashboard.component';
import { EntrepriseLayoutComponent } from './entreprise/components/entreprise-layout/entreprise-layout.component';
import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';
import { AuthSelectionComponent } from './auth/components/auth-selection/auth-selection.component';
import { AppComponent } from './app.component';
import { StartComponent } from './start/start/start.component';
import { ReviewsComponent } from './entreprise/components/reviews/reviews.component';

export const routes: Routes = [
  // Redirection globale vers espace entreprise dashboard
  { path: '', redirectTo: 'EspaceEntreprise/1/dashboard', pathMatch: 'full' },

  // Espace entreprise avec sidebar
  {
    path: 'EspaceEntreprise/:id',
    component: EntrepriseLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EntrepriseDashboardComponent },
      { path: 'profil', component: RestaurantProfileComponent },
      { path: 'reservations', component: ReservationsComponent },
      { path: 'reservations/:reservationId', component: ReservationDetailsComponent },
      { path: 'reviews', component: ReviewsComponent }
    ]
  },

  // Espace admin avec sidebar
  {
    path: 'EspaceAdmin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'restaurants/:id', component: RestaurantDetailsComponent },
      { path: 'reviews/:id', component: AdminReviewsComponent },
      { path: 'pages', component: RestaurantsPageComponent},
      { path: 'restaurants', component: RestaurantRequestsComponent },
      { path: 'restaurantsPending/:id', component: RestaurantPendingComponent },
    ]
  },

  // Routes spécifiques sans sidebar (pages "détails" par exemple)
  { path: 'restaurants/:id', component: RestaurantDetailsComponent },
  { path: 'restaurantsPending/:id', component: RestaurantPendingComponent },
  { path: 'profil/:id', component: RestaurantProfileComponent },
  { path: 'reservations', component: ReservationsComponent }, // à voir si tu veux sidebar ou pas ici
  { path: 'reservations/:id', component: ReservationDetailsComponent },
  

  // Wildcard route pour gérer 404 (redirige vers dashboard entreprise)
  { path: '**', redirectTo: 'EspaceEntreprise/1/dashboard' },
  { path: '', component: StartComponent},

];
