import { Component } from '@angular/core';
import { AuthModule } from "./auth/auth.module";
import { NgIf, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
    imports: [
        RouterModule,
        AuthModule,
        NgIf,
        CommonModule,
        HeaderComponent,
        FooterComponent
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



