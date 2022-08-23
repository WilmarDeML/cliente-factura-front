import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title: string = 'App Angular'

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    const usuario = this.authService.usuario
    this.authService.logout()
    Swal.fire('Logout', `Hola ${usuario.username}, te deslogueaste correctamente`, 'success')
    this.router.navigate(['/login'])
  }

}
