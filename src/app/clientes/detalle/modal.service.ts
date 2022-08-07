import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false
  #notificarUpload = new EventEmitter<any>()

  constructor() { }

  abrirCerrarModal(): void {
    this.modal = !this.modal
  }

  get notificarUpload(): EventEmitter<any> {
    return this.#notificarUpload
  }
}
