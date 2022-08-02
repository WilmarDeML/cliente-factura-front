import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'paginador-nav',
  templateUrl: './paginador.component.html',
})
export class PaginadorComponent implements OnInit {

  @Input() paginador: any

  paginas: number[]

  constructor() { }

  ngOnInit(): void {
    this.paginas = new Array(this.paginador?.totalPages).fill(0).map((_valor, i) => i + 1)
  }

}
