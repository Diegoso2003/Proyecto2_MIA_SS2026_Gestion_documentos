import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-error',
  imports: [
    MatDialogModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatDialogActions,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './modal-error.html',
  styleUrl: './modal-error.css',
})
export class ModalError {
  readonly dialogRef = inject(MatDialogRef<ModalError>);
  readonly mensaje = inject<string>(MAT_DIALOG_DATA);
}
