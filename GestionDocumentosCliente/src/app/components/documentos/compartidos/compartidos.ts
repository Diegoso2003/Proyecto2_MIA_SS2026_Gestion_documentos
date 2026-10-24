import { Component, effect, inject, input, signal } from '@angular/core';
import { CompartidosService } from '../../../services/compartidos-service';
import { ErrorService } from '../../../util/services/error-service';
import { ContenidoCarpeta } from '../../../models/documentos/vista_documento';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CarpetaItem } from '../carpeta-item/carpeta-item';
import { DocumentoItem } from '../documento-item/documento-item';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-compartidos',
  imports: [
    RouterLink,
    CarpetaItem,
    DocumentoItem,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './compartidos.html',
  styleUrl: './compartidos.css',
})
export class Compartidos {
  private _compartidosService = inject(CompartidosService);
  private _errorInfo = inject(ErrorService);
  id = input<string | null>(null);

  contenido = signal<ContenidoCarpeta>({ carpetas: [], documentos: [], nombre: '', ancestros: [] });

  carpetaResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) =>
      params.id
        ? this._compartidosService.obtenerCarpetaConId(params.id)
        : this._compartidosService.obtenerCarpetasCompartidas(),
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
      this.contenido.set(this.carpetaResource.value()!);
    });
  }

  recargar(): void {
    this.carpetaResource.reload();
  }
}
