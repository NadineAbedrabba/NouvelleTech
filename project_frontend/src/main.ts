import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import '@angular/compiler';
import { routes } from './app/app.routes';  // Importez les routes depuis app.routes.ts
import { provideAnimations } from '@angular/platform-browser/animations';
// L'import de bootstrap est géré via angular.json

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Utilisez appRoutes ici
    provideHttpClient(),
    provideAnimations()
  ],
}).catch((err) => console.error(err));




