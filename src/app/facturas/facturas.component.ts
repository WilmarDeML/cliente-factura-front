import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { mergeMap, Observable, map } from 'rxjs';
import Swal from 'sweetalert2';
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
    private facturaService: FacturaService,
    private router: Router) { }

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

    if (this.existeItem(producto.id)) {
      this.incrementarCantidad(producto.id)
    } else {
      let nuevoItem = new ItemFactura()
      nuevoItem.producto = producto
      this.factura.items.push(nuevoItem)
    }

    this.autoCompleteControl.setValue('')
    event.option.focus()
    event.option.deselect()
  }

  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = +event.target.value

    if(cantidad === 0) {
      return this.eliminarItemFactura(id)
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id) {
        item.cantidad = cantidad
      }
      return item
    })
  }

  existeItem(id: number): boolean {
    return this.factura.items.some((item: ItemFactura) => item.producto.id === id)
  }

  incrementarCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id) {
        ++item.cantidad
      }
      return item
    })
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => item.producto.id !== id)
  }

  crearFactura(facturaForm: any): void {
    if (!this.factura.items.length) {
      this.autoCompleteControl.setErrors({'invalid': true})
    }
    if (facturaForm.form.valid && this.factura.items.length) {
      this.facturaService.crearFactura(this.factura).subscribe(factura => {
        console.log(factura)
        Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, 'success')
        this.router.navigate(['/clientes'])
      })
    }
  }
}
