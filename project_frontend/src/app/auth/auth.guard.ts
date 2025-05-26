import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Vérifier si l'utilisateur est connecté en vérifiant le token dans le localStorage
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // L'utilisateur est connecté, autoriser l'accès à la route
      return true;
    }
    
    // L'utilisateur n'est pas connecté, rediriger vers la page de connexion
    // et stocker l'URL demandée pour y revenir après la connexion
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    
    return false;
  }
}