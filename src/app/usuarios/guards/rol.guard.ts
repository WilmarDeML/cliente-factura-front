import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const rol = route.data['rol'] as string
    console.log(rol)
    return this.authService.hasRol(rol) || (Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username || 'amigo'} no tienes acceso a este recurso!`, 'warning') && this.router.navigate(['/clientes']));
  }

}
