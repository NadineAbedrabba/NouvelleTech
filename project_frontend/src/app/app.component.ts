import { Component } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf } from '@angular/common'; // ✅ import NgIf
import { RouterOutlet } from '@angular/router';
import { ReservationFormComponent } from "./reservation-form/reservation-form.component";
import { MesReservationsComponent } from "./mes-reservations/mes-reservations.component";
import { RestaurantDetailsComponent } from './admin/components/restaurant-details/restaurant-details.component';
import { DetailRestoComponent } from './detail-resto/detail-resto.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    AuthModule,
    NgIf,
    RouterOutlet,
    ReservationFormComponent,
    MesReservationsComponent,
   DetailRestoComponent
] //
 //
 //
})
export class AppComponent {
  title = 'project_frontend';
  showAuthModal = false;

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}



