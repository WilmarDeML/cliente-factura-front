import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'paginador-nav',
  templateUrl: './paginador.component.html',
})
export class PaginadorComponent implements OnInit, OnChanges {

  @Input() paginador: any

  paginas: number[]
  desde: number
  hasta: number

  constructor() { }

  ngOnChanges(_changes: SimpleChanges): void {
    this.desde = Math.min(Math.max(1, this.paginador.number - 2), this.paginador.totalPages - 6)
    this.hasta = Math.min(this.paginador.totalPages, this.paginador.number + (6 - (this.paginador.number - this.desde)))

    if (this.paginador.totalPages > 5) {
      this.paginas = new Array((this.hasta - this.desde) + 1).fill(0).map((_valor, i) => i + this.desde)
    } else {
      this.paginas = new Array(this.paginador?.totalPages).fill(0).map((_valor, i) => i + 1)
    }
  }

  ngOnInit(): void {}

}
