import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Cliente } from './cliente'
import { ClienteService } from './cliente.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente()
  titulo: string = 'Crear cliente'
  errores: string[]

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.cargarCliente()
  }

  cargarCliente(): void {
    this.activateRoute.params.subscribe(params => {
      const id = params['id']
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente
          this.titulo = 'Editar cliente'
        })
      }
    })
  }

  create(): void {
    this.clienteService.create(this.cliente)
      .subscribe({
        next: cliente => {
          this.cliente = cliente
          this.router.navigate(['/clientes'])
          Swal.fire(this.titulo, `El client ${cliente.nombre} ha sido creado con éxito!`, 'success')
        },
        error: err => {
          this.errores = err.error.errores as string[]
          console.error(err.error.errores)
        }
      })
  }

  update(cliente: Cliente) {
    console.log(cliente)
    this.clienteService.update(cliente)
      .subscribe({
        next: json => {
          this.router.navigate(['/clientes'])
          console.log(json.cliente)
          Swal.fire(this.titulo, `${json.mensaje} => ${json.cliente.nombre}`, 'success')
        },
        error: err => {
          this.errores = err.error.errores as string[]
          console.error(err.error.errores)
        }
      })
  }
}
