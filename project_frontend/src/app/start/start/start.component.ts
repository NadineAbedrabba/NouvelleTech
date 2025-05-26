import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthSelectionComponent } from 'src/app/auth/components/auth-selection/auth-selection.component';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  imports: [
    // autres imports...
    AuthSelectionComponent, 
    RouterModule // <-- importer le standalone component ici
  ],
  standalone:true
})
export class StartComponent {
  title = 'project_frontend';
  showAuthModal = false;

  openAuthModal() {
    this.showAuthModal = true;
  }

  closeAuthModal() {
    this.showAuthModal = false;
  }
}
