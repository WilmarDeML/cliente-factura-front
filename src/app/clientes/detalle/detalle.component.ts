import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente: Cliente

  fotoSeleccionada: File

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id')
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente
        })
      }
    })
  }

  seleccionarFoto(event): void {
    this.fotoSeleccionada = event.target.files[0]
    console.log(this.fotoSeleccionada)
    if (!this.fotoSeleccionada.type.includes('image')) {
      Swal.fire('Error de archivo', 'El archivo debe ser de tipo imagen', 'error')
      this.fotoSeleccionada = null
    }
  }

  subirFoto(): void {
    if(this.fotoSeleccionada) {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        cliente => {
          this.cliente = cliente
          Swal.fire('La foto se ha subido completamente!', `La foto se ha subido con éxito: ${this.cliente.foto}`)
        }
      )
    } else {
      Swal.fire('Error Upload', 'Debe seleccionar un archivo de tipo imagen', 'error')
    }
  }
}
