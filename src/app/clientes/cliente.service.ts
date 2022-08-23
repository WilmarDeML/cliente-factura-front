import { Injectable } from '@angular/core'
import { Cliente } from './cliente'
import { Observable, throwError, map, catchError, tap } from 'rxjs'
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { Region } from './region'
import { AuthService } from '../usuarios/auth.service'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes'

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  private esNoAutorizado(e): boolean {
    let esNoAutorizado = false
    if (e.status === 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout()
      }
      this.router.navigate(['/login'])
      return  !esNoAutorizado
    }
    if (e.status === 403) {
      Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning')
      this.router.navigate(['/clientes'])
      return  !esNoAutorizado
    }
    return esNoAutorizado
  }

  getClientes(page: number): Observable<Cliente[]> {
    return this.http.get(`${this.urlEndPoint}/page/${page - 1}`).pipe(
      tap((respuesta: any) => {
        console.log('Tap 1');
        (respuesta.content as Cliente[]).forEach(cliente => console.log(cliente.nombre))
      }),
      map((respuesta: any) => {
        (respuesta.content as Cliente[]).forEach(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase()
          // cliente.createAt = formatDate(cliente.createAt, 'EEEE d, MMMM y', 'es') // fullDate
          return cliente
        })
        return respuesta;
      }),
      tap((respuesta: any) => (respuesta.content as Cliente[]).forEach( cliente => console.log(cliente.nombre))) // Toma los cambios que hizo el map
    )
  }

  // Obteniendo sólo el cliente de la respuesta del back
  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente).pipe(
      map((respuesta: any) => respuesta.cliente as Cliente),
      catchError(e => {
        if (this.esNoAutorizado(e)) {
          return throwError(() => e)
        }
        if (e.status === 400) {
          return throwError(() => e)
        }
        console.log(e.error.mensaje)
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    )
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (this.esNoAutorizado(e)) {
          return throwError(() => e)
        }
        this.router.navigate(['clientes'])
        console.log(e.error.mensaje)
        Swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(() => e)
      })
    )
  }

  // Obteniendo toda la respuesta del back
  update(cliente: Cliente): Observable<any> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if (this.esNoAutorizado(e)) {
          return throwError(() => e)
        }
        if (e.status === 400) {
          return throwError(() => e)
        }
        console.log(e.error.mensaje)
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (this.esNoAutorizado(e)) {
          return throwError(() => e)
        }
        console.log(e.error.mensaje)
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    )
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('id', id)

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.esNoAutorizado(e)
        return throwError(() => e)
      })
    )
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`).pipe(
      catchError(e => {
        this.esNoAutorizado(e)
        return throwError(() => e)
      })
    )
  }
}
