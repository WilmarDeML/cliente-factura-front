import { Component, OnInit } from '@angular/core'
import Swal from 'sweetalert2'
import { Cliente } from './cliente'
import { ClienteService } from './cliente.service'
import { tap } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { ModalService } from './detalle/modal.service'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[]
  paginador: any
  clienteSeleccionado: Cliente

  constructor(
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private modalService: ModalService) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page') || 1
      this.clienteService.getClientes(page).pipe(
        tap((response: any) => {
          this.clientes = response.content
          this.paginador = response
        })
      ).subscribe()
    })

    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id === clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto
        }
        return clienteOriginal
      })
    })
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `Eliminará el cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id)
          .subscribe(json => {
            this.clientes = this.clientes.filter(c => c.id !== cliente.id)
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              `${json.mensaje} => ${cliente.nombre}`,
              'success'
            )
          })
      }
    })
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente
    this.modalService.abrirCerrarModal()
  }
}
