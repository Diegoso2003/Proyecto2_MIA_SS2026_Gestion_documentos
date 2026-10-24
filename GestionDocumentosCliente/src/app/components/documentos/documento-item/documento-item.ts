import { Component, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Documento } from '../../../models/documentos/vista_documento';
import { DocumentoService } from '../../../services/documento-service';
import { ErrorService } from '../../../util/services/error-service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CompartidosDialog } from '../compartidos-dialog/compartidos-dialog';

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
  cambio = output<void>();
  private _documentoService = inject(DocumentoService);
  private _dialog = inject(MatDialog);
  private _errorService = inject(ErrorService);

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
    console.log('descargar documento', this.documento()._id);
  }

  compartir() {
    this._dialog.open(CompartidosDialog, {
      data: {
        recursoId: this.documento()._id,
        recursoTipo: 'documento',
      },
      width: '640px',
      maxHeight: '90vh',
    });
  }

  renombrar() {
    const nombre = prompt('Nuevo nombre', this.documento().nombre);
    if (!nombre || nombre === this.documento().nombre) return;
    console.log('renombrar documento', this.documento()._id, nombre);
  }

  destacar() {
    console.log('destacar documento', this.documento()._id);
  }

  eliminar() {
    this._documentoService.mandarAPapelera(this.documento()._id).subscribe({
      next: () => {
        this.cambio.emit();
      },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error.message ?? 'error al mandar a papelera intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }

  cargarDetalles() {
    this.detalles.set(null);
    console.log('detalles documento', this.documento()._id);
    const d = this.documento();
    this.detalles.set({
      tipo: d.mime_type,
      propietario: d.propietario_id,
      creado: d.createdAt,
      ubicacion: d.ancestros.at(-1)?.nombre ?? 'Mis documentos',
    });
  }
}
