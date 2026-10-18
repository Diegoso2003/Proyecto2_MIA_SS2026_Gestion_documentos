import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalError } from '../components/modal-error/modal-error';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly _dialog = inject(MatDialog);

  mostrarMensaje(mensaje: string): void {
    const dialogRef = this._dialog.open(ModalError, {
      data: mensaje
    });
  }
}
