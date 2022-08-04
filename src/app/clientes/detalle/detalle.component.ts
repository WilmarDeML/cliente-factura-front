import { HttpEventType } from '@angular/common/http';
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
  progreso: number

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
    this.progreso = 0
    console.log(this.fotoSeleccionada)
    if (!this.fotoSeleccionada.type.includes('image')) {
      Swal.fire('Error de archivo', 'El archivo debe ser de tipo imagen', 'error')
      this.fotoSeleccionada = null
    }
  }

  subirFoto(): void {
    if(this.fotoSeleccionada) {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = event.total ? Math.round(100 * event.loaded / event.total) : 0
          }
          if(event.type === HttpEventType.Response){
            let respuesta: any = event.body
            this.cliente = respuesta.cliente as Cliente
            Swal.fire('La foto se ha subido completamente!', `${respuesta.mensaje} ${this.cliente.foto}`, 'success')
          }
        }
      )
    } else {
      Swal.fire('Error Upload', 'Debe seleccionar un archivo de tipo imagen', 'error')
    }
  }
}
