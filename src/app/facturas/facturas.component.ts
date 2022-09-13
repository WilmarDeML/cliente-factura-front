import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, Observable, map } from 'rxjs';
import { ClienteService } from '../clientes/cliente.service';
import { Factura } from './models/factura';
import { ItemFactura } from './models/item-factura';
import { Producto } from './models/producto';
import { FacturaService } from './services/factura.service';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva factura'
  factura: Factura = new Factura()
  autoCompleteControl = new FormControl('');
  productos: string[] = ['Mesa', 'Tablet', 'PlayStation', 'TV LG', 'Portátil', 'Mouse', 'Teclado'];
  productosFiltrados: Observable<Producto[]>;

  constructor(
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId')
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente)
    })
    this.productosFiltrados = this.autoCompleteControl.valueChanges.pipe(
      map(value => typeof value === 'string' ? value : value['nombre']),
      mergeMap(value => value ? this._filter(value) : []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto?.nombre || undefined
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto
    console.log(producto)

    let nuevoItem = new ItemFactura()
    nuevoItem.producto = producto
    this.factura.items.push(nuevoItem)

    this.autoCompleteControl.setValue('')
    event.option.focus()
    event.option.deselect()
  }
}
