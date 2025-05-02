import { Component } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf } from '@angular/common'; // ✅ import NgIf

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    AuthModule,
    NgIf, // ✅ Ajoute-le ici
  ]
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



