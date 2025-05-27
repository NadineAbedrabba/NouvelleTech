import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token d'authentification si disponible
    const currentUser = this.userService.getCurrentUser();
    if (currentUser && localStorage.getItem('authToken')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
    }

    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          // Intercepter les réponses d'authentification réussies
          if (request.url.includes('/authenticate') && event.status === 200 && event.body) {
            // Stocker le token
            if (event.body.token) {
              localStorage.setItem('authToken', event.body.token);
            }
            
            // Stocker les informations de l'utilisateur
            if (event.body.user) {
              this.userService.setCurrentUser(event.body.user);
            }
          }
        }
      })
    );
  }
}
