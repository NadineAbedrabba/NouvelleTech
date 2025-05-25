import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';


const routes: Routes = [
  {
    path: 'form',
    loadComponent: () =>
      import('./reservation-form/reservation-form.component').then(m => m.ReservationFormComponent)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
