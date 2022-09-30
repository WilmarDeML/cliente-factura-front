import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

import { URL_BACKEND } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  // private urlEndpoint: string = 'http://localhost:8080/api/facturas'
  private urlEndpoint: string = `${URL_BACKEND}/api/facturas`

  constructor(private httpClient: HttpClient) { }

  getFactura(id:number): Observable<Factura> {
    return this.httpClient.get<Factura>(`${this.urlEndpoint}/${id}`)
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlEndpoint}/${id}`)
  }

  filtrarProductos(term: string): Observable<Producto[]> {
    return this.httpClient.get<Producto[]>(`${this.urlEndpoint}/filtrar-productos/${term}`)
  }

  crearFactura(factura: Factura): Observable<Factura> {
    return this.httpClient.post<Factura>(this.urlEndpoint, factura)
  }
}
