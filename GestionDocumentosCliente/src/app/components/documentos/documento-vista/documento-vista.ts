import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ErrorService } from '../../../util/services/error-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentoEditor } from '../documento-editor/documento-editor';
import { SidebarComentarios } from '../sidebar-comentarios/sidebar-comentarios';
import { DocumentoService } from '../../../services/documento-service';

@Component({
  selector: 'app-documento-vista',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatTooltipModule,
    DocumentoEditor,
    SidebarComentarios,
  ],
  templateUrl: './documento-vista.html',
  styleUrl: './documento-vista.css',
  host: { class: 'flex flex-col h-full' },
})
export class DocumentoVista {
  id = input.required<string>();

  private _location = inject(Location);
  private _documentoService = inject(DocumentoService);
  private _errorInfo = inject(ErrorService);

  documentoResource = rxResource({
    params: () => ({ id: this.id() }),
    stream: ({ params }) => this._documentoService.obtenerPorId(params.id),
  });

  contenido = signal('');
  original = signal('');
  guardando = signal(false);
  sidebarAbierto = signal(false);

  documento = computed(() => this.documentoResource.value());
  hayCambios = computed(() => this.contenido() !== this.original());
  puedeEditar = computed(() => this.documento()?.permiso === 'edicion');
  puedeComentar = computed(() => {
    const p = this.documento()?.permiso;
    return p === 'comentar' || p === 'edicion';
  });

  constructor() {
    effect(() => {
      const doc = this.documentoResource.value();
      if (doc) {
        this.contenido.set(doc.contenido);
        this.original.set(doc.contenido);
      }
    });
    effect(() => {
      const error = this.documentoResource.error();
      if (error) {
        this._errorInfo.mostrarMensaje(
          (error as HttpErrorResponse).error?.message ?? 'Error al obtener el documento',
        );
      }
    });
  }

  guardar(): void {
    if (!this.hayCambios() || this.guardando()) return;
    this.guardando.set(true);
    const contenido = this.contenido();
    this._documentoService.actualizarContenido(this.id(), contenido).subscribe({
      next: () => {
        this.original.set(contenido);
        this.guardando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.guardando.set(false);
        this._errorInfo.mostrarMensaje(e.error?.message ?? 'Error al guardar el documento');
      },
    });
  }

  volver(): void {
    this._location.back();
  }
}
