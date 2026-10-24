import { Component, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Carpeta } from '../../../models/documentos/vista_documento';
import { formatTamano } from '../../../util/format';
import { CarpetaService } from '../../../services/carpeta-service';
import { ErrorService } from '../../../util/services/error-service';
import { HttpErrorResponse } from '@angular/common/http';
import { CompartidosDialog } from '../compartidos-dialog/compartidos-dialog';
import { MatDialog } from '@angular/material/dialog';

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
  private _carpetaService = inject(CarpetaService);
  private _errorService = inject(ErrorService);

  private _dialog = inject(MatDialog);
  detalles = signal<{ propietario: string; creado: string; ubicacion: string } | null>(null);

  descargar() {
    console.log('descargar carpeta', this.carpeta()._id);
  }

  compartir() {
    this._dialog.open(CompartidosDialog, {
      data: {
        recursoId: this.carpeta()._id,
        recursoTipo: 'carpeta',
      },
      width: '640px',
      maxHeight: '90vh',
    });
  }
  renombrar() {
    const nombre = prompt('Nuevo nombre', this.carpeta().nombre);
    if (!nombre || nombre === this.carpeta().nombre) return;
    console.log('renombrar carpeta', this.carpeta()._id, nombre);
  }

  destacar() {
    console.log('destacar carpeta', this.carpeta()._id);
  }

  eliminar() {
    this._carpetaService.eliminarCarpeta(this.carpeta()._id).subscribe({
      next: () => {
        this.cambio.emit();
      },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error.message ?? 'error al eliminarCarpeta intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }

  cargarDetalles() {
    this.detalles.set(null);
    console.log('detalles carpeta', this.carpeta()._id);
    const c = this.carpeta();
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
