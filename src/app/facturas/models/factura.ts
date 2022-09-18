import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: Array<ItemFactura> = [];
  cliente: Cliente;
  total: number = 0;
  createAt: string

  public calcularGranTotal(): number {
    this.total = this.items.reduce((acc, item) => item.calcularImporte() + acc, 0)
    return this.total
  }
}
