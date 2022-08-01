import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
})
export class DirectivaComponent {
  listaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];
  habilitar: boolean = true;
  textoBoton: string = 'Ocultar'
  constructor() { }

  setHabilitar(): void {
    this.habilitar = !this.habilitar
  }
}
