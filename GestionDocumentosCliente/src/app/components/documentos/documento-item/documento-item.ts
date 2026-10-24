import { Component, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Documento } from '../../../models/documentos/vista_documento';

@Component({
  selector: 'app-documento-item',
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  templateUrl: './documento-item.html',
  styleUrl: './documento-item.css',
})
export class DocumentoItem {
  documento = input.required<Documento>();
  permitirRenombrar = input<boolean>(true);
  permitirEliminar = input<boolean>(true);
  permitirCompartir = input<boolean>(true);
  cambio = output<void>(); // el padre recarga la lista cuando se emite
  // private _documentoService = inject(DocumentoService);

  detalles = signal<{
    tipo: string;
    propietario: string;
    creado: string;
    ubicacion: string;
  } | null>(null);

  tamano(): string {
    const b = this.documento().tamano_bytes;
    if (b < 1024) return `${b} B`;
    if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
    if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
    return `${(b / 1024 ** 3).toFixed(1)} GB`;
  }

  descargar() {
    // no recarga
    console.log('descargar documento', this.documento()._id);
    // this._documentoService.descargar(this.documento()._id).subscribe(blob => { /* guardar blob */ });
  }

  compartir() {
    console.log('compartir documento', this.documento()._id);
    // this._documentoService.compartir(this.documento()._id, /* datos */).subscribe(() => this.cambio.emit());
  }

  renombrar() {
    const nombre = prompt('Nuevo nombre', this.documento().nombre);
    if (!nombre || nombre === this.documento().nombre) return;
    console.log('renombrar documento', this.documento()._id, nombre);
    // this._documentoService.renombrar(this.documento()._id, nombre).subscribe(() => this.cambio.emit());
  }

  destacar() {
    console.log('destacar documento', this.documento()._id);
    // this._documentoService.destacar(this.documento()._id).subscribe(() => this.cambio.emit());
  }

  eliminar() {
    if (!confirm(`¿Eliminar "${this.documento().nombre}"?`)) return;
    console.log('eliminar documento', this.documento()._id);
    // this._documentoService.eliminar(this.documento()._id).subscribe(() => this.cambio.emit());
  }

  cargarDetalles() {
    // subconsulta, no recarga
    this.detalles.set(null);
    console.log('detalles documento', this.documento()._id);
    // this._documentoService.obtenerDetalles(this.documento()._id).subscribe(d => this.detalles.set(d));
    const d = this.documento(); // datos de ejemplo, reemplazar por la subconsulta
    this.detalles.set({
      tipo: d.mime_type,
      propietario: d.propietario_id,
      creado: d.createdAt,
      ubicacion: d.ancestros.at(-1)?.nombre ?? 'Mis documentos',
    });
  }
}
