import { Component, inject, OnInit, signal } from '@angular/core';
import { PapeleraService } from '../../../services/papelera-service';
import { ErrorService } from '../../../util/services/error-service';
import { ContenidoPapelera } from '../../../models/documentos/papelera';
import { HttpErrorResponse } from '@angular/common/http';
import { Ancestro } from '../../../models/documentos/vista_documento';
import { formatTamano } from '../../../util/format';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-papelera',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './papelera.html',
  styleUrl: './papelera.css',
})
export class Papelera implements OnInit {
  private _papeleraService = inject(PapeleraService);
  private _errorInfo = inject(ErrorService);

  contenido = signal<ContenidoPapelera>({ carpetas: [], documentos: [] });
  cargando = signal(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this._papeleraService.obtenerPapelera().subscribe({
      next: (data) => {
        this.contenido.set(data);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargando.set(false);
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al obtener la papelera');
      },
    });
  }

  total(): number {
    const c = this.contenido();
    return c ? c.carpetas.length + c.documentos.length : 0;
  }
  vacia(): boolean {
    return this.total() === 0;
  }

  rutaCompleta(ancestros?: Ancestro[] | null): string {
    const lista = ancestros ?? [];
    return ['Mis documentos', ...lista.map((a) => a.nombre)].join(' / ');
  }

  ubicacion(ancestros?: Ancestro[] | null): string {
    const lista = ancestros ?? [];
    const nombres = ['Mis documentos', ...lista.map((a) => a.nombre)];
    if (nombres.length > 4) {
      return [nombres[0], '…', ...nombres.slice(-2)].join(' / ');
    }
    return nombres.join(' / ');
  }

  tamano(bytes?: number): string {
    return formatTamano(bytes);
  }

  restaurarCarpeta(id: string): void {
    /**
    this._papeleraService.restaurarCarpeta(id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) =>
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al restaurar la carpeta'),
    });*/
  }

  restaurarDocumento(id: string): void {
    /*
    this._papeleraService.restaurarDocumento(id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) =>
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al restaurar el documento'),
    });*/
  }

  eliminarCarpeta(id: string, nombre: string): void {
    /* if (!confirm(`¿Eliminar definitivamente la carpeta "${nombre}"? No se puede deshacer.`)) return;

    this._papeleraService.eliminarCarpetaDefinitivo(id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) =>
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al eliminar la carpeta'),
    });*/
  }

  eliminarDocumento(id: string, nombre: string): void {
    /*if (!confirm(`¿Eliminar definitivamente "${nombre}"? No se puede deshacer.`)) return;

    this._papeleraService.eliminarDocumentoDefinitivo(id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) =>
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al eliminar el documento'),
    });*/
  }

  vaciarPapelera(): void {
    /*if (!confirm('¿Vaciar la papelera? Se eliminará todo definitivamente.')) return;

    this._papeleraService.vaciarPapelera().subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) =>
        this._errorInfo.mostrarMensaje(err?.error?.message ?? 'Error al vaciar la papelera'),
    });*/
  }
}
