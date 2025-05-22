import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReviewContainerComponent } from './review-container/review-container.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Route par défaut
  { path: 'review', component: ReviewContainerComponent }, // Nouvelle route pour la page de review
  // Vous pouvez ajouter d'autres routes ici
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }