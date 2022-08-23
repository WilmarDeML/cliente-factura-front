import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor Sign In!'
  usuario: Usuario

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire('Login', `¡Hola ${this.authService.usuario.username} ya te has autenticado!`, 'info')
      this.router.navigate(['/clientes'])
    }
  }

  login() {
    console.log(this.usuario)
    if(!this.usuario.username || !this.usuario.password) {
      Swal.fire('Error Login', 'Username o password vacío', 'error')
      return
    }
    this.authService.login(this.usuario).subscribe({
      next: respuesta => {
      console.log(respuesta)

      this.authService.guardarUsuario(respuesta.access_token)
      this.authService.guardarToken(respuesta.access_token)

      this.router.navigate(['/clientes'])
      Swal.fire('Login', `¡Hola ${this.authService.usuario.username}, has iniciado sección con éxito`, 'success')
    }, error: err => {
      if(err.status === 400) {
        Swal.fire('Error Login', '¡Usuario o clave incorrectas!', 'error')
      }
    }
  })
  }

}
