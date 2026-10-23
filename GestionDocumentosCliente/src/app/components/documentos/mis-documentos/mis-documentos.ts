import { Component, effect, inject, input, signal } from '@angular/core';
import { CarpetaService } from '../../../services/carpeta-service';
import { ErrorService } from '../../../util/services/error-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CarpetaItem } from '../carpeta-item/carpeta-item';
import { DocumentoItem } from '../documento-item/documento-item';
import { Detalles } from '../../../models/documentos/vista_documento';
import { formatTamano } from '../../../util/format';

@Component({
  selector: 'app-mis-documentos',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterLink,
    CarpetaItem,
    DocumentoItem,
  ],
  templateUrl: './mis-documentos.html',
  styleUrl: './mis-documentos.css',
})
export class MisDocumentos {
  id = input<string | null>(null);
  private _carpetaService = inject(CarpetaService);
  private _errorInfo = inject(ErrorService);

  carpetaResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) =>
      params.id
        ? this._carpetaService.obtenerDocumentosPorCarpeta(params.id)
        : this._carpetaService.obtenerMisDocumentos(),
  });

  constructor() {
    effect(() => {
      const error = this.carpetaResource.error();
      if (error) {
        const mensaje =
          (error as HttpErrorResponse).error?.message ?? 'Error al obtener los documentos';
        this._errorInfo.mostrarMensaje(mensaje);
      }
    });
    effect(() => {
      const documentos = this.carpetaResource.value();
      console.log(documentos);
    });
  }
  documentos = signal<string[]>([]);
  detalles = signal<Detalles | null>(null);
  recargar(): void {
    this.carpetaResource.reload();
  }

  crearCarpeta(): void {
    const nombre = prompt('Nombre de la carpeta');
    if (!nombre) return;
    //metedo para crear la carpeta
  }

  crearDocumento(): void {
    const nombre = prompt('Nombre del documento');
    if (!nombre) return;
    //metodo para crear el documento
  }

  cargarArchivo(e: Event) {
    const input = e.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) return;
    const form = new FormData();
    form.append('archivo', archivo);
  }

  descargarActual() {
    //descarga
  }

  compartirActual(): void {
    //compartir
  }

  renombrarActual(nombreActual: string) {
    const nombre = prompt('Nuevo nombre', nombreActual);
    if (!nombre || nombre === nombreActual) return;
    // renombrar
  }

  destacarActual() {
    //destacar
  }

  eliminarActual() {
    if (!confirm('¿Eliminar esta carpeta?')) return;
    // eliminarActual
  }

  cargarDetallesActual() {
    // subconsulta, no recarga
    this.detalles.set(null);
    console.log('cargarDetallesActual', this.id());
    // this._carpetaService.obtenerDetalles(this.id()!).subscribe(d => this.detalles.set(d));
    const c = this.carpetaResource.value();
  }

  limpiarDetalles() {
    this.detalles.set(null);
  }
  formatSize(tamaño?: number) {
    return formatTamano(tamaño);
  }
}
