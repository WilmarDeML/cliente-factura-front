import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Factura } from 'src/app/facturas/models/factura';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

import { URL_BACKEND } from 'src/app/config/config';

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
  urlBack: string = URL_BACKEND

  constructor(
    private clienteService: ClienteService,
    public modalService: ModalService,
    private facturaService: FacturaService,
    public authService: AuthService) { }

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

  delete(factura: Factura): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `Eliminará la factura ${factura.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id).subscribe(() => {
            this.cliente.facturas = this.cliente.facturas.filter(f => f.id !== factura.id)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `Factura => ${factura.descripcion} eliminada con éxito`,
              'success'
            )
          })
      }
    })
  }
}
