import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Carpeta } from '../../../models/documentos/vista_documento';
import { formatTamano } from '../../../util/format';

@Component({
  selector: 'app-carpeta-item',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './carpeta-item.html',
  styleUrl: './carpeta-item.css',
})
export class CarpetaItem {
  carpeta = input.required<Carpeta>();
  permitirRenombrar = input<boolean>(true);
  permitirEliminar = input<boolean>(true);
  permitirCompartir = input<boolean>(true);
  carpetaCompartida = input<boolean>(false);
  cambio = output<void>(); // el padre recarga la lista cuando se emite
  // private _carpetaService = inject(CarpetaService);

  detalles = signal<{ propietario: string; creado: string; ubicacion: string } | null>(null);

  descargar() {
    // no recarga
    console.log('descargar carpeta', this.carpeta()._id);
    // this._carpetaService.descargar(this.carpeta()._id).subscribe(blob => { /* guardar blob */ });
  }

  compartir() {
    console.log('compartir carpeta', this.carpeta()._id);
    // this._carpetaService.compartir(this.carpeta()._id, /* datos */).subscribe(() => this.cambio.emit());
  }

  renombrar() {
    const nombre = prompt('Nuevo nombre', this.carpeta().nombre);
    if (!nombre || nombre === this.carpeta().nombre) return;
    console.log('renombrar carpeta', this.carpeta()._id, nombre);
    // this._carpetaService.renombrar(this.carpeta()._id, nombre).subscribe(() => this.cambio.emit());
  }

  destacar() {
    console.log('destacar carpeta', this.carpeta()._id);
    // this._carpetaService.destacar(this.carpeta()._id).subscribe(() => this.cambio.emit());
  }

  eliminar() {
    if (!confirm(`¿Eliminar la carpeta "${this.carpeta().nombre}"?`)) return;
    console.log('eliminar carpeta', this.carpeta()._id);
    // this._carpetaService.eliminar(this.carpeta()._id).subscribe(() => this.cambio.emit());
  }

  cargarDetalles() {
    // subconsulta, no recarga
    this.detalles.set(null);
    console.log('detalles carpeta', this.carpeta()._id);
    // this._carpetaService.obtenerDetalles(this.carpeta()._id).subscribe(d => this.detalles.set(d));
    const c = this.carpeta(); // datos de ejemplo, reemplazar por la subconsulta
    this.detalles.set({
      propietario: c.propietario_id,
      creado: c.createdAt,
      ubicacion: c.ancestros.at(-1)?.nombre ?? 'Mis documentos',
    });
  }
  formatSize(tamaño?: number) {
    return formatTamano(tamaño);
  }
}
