import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
// import { CLIENTES } from './clientes.json';
import { Observable, of, throwError, map, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes'

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);
    // return this.http.get<Cliente[]>(this.urlEndPoint); // Sin map
    return this.http.get(this.urlEndPoint).pipe(map(response => response as Cliente[])); // Con map
  }

  // Obteniendo sólo el cliente de la respuesta del back
  create(cliente: Cliente) : Observable<Cliente> {
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    );
  }

  getCliente(id: number) : Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['clientes'])
        console.log(e.error.mensaje)
        Swal.fire('Error al editar', e.error.mensaje, 'error')
        return throwError(() => e)
      })
    );
  }

  // Obteniendo toda la respuesta del back
  update(cliente: Cliente) : Observable<any>{
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    );
  }

  delete(id: number) : Observable<any> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error')
        return throwError(() => e)
      })
    );;
  }
}