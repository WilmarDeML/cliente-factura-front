import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente
  fotoSeleccionada: File
  progreso: number
  estadoModal: boolean

  constructor(private clienteService: ClienteService, private modalService: ModalService) { }

  ngOnInit(): void { }

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
            this.modalService.notificarUpload.emit(this.cliente)
            Swal.fire('La foto se ha subido completamente!', `${respuesta.mensaje}`, 'success')
          }
        }
      )
    } else {
      Swal.fire('Error Upload', 'Debe seleccionar un archivo de tipo imagen', 'error')
    }
  }

  cerrarModal(): void {
    this.modalService.abrirCerrarModal()
    this.fotoSeleccionada = null
    this.progreso = 0
  }

  getEstadoModal(): boolean {
    return this.modalService.modal
  }
}
