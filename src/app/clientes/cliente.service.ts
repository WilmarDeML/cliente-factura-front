import { Injectable } from '@angular/core'
import { Cliente } from './cliente'
import { Observable, throwError, map, catchError, tap } from 'rxjs'
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http'
import Swal from 'sweetalert2'
import { Router } from '@angular/router'
import { Region } from './region'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes'

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' })
  constructor(private http: HttpClient, private router: Router) { }

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
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((respuesta: any) => respuesta.cliente as Cliente),
      catchError(e => {
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
        this.router.navigate(['clientes'])
        console.log(e.error.mensaje)
        Swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(() => e)
      })
    )
  }

  // Obteniendo toda la respuesta del back
  update(cliente: Cliente): Observable<any> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
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
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
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
    return this.http.request(req)
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`)
  }
}
