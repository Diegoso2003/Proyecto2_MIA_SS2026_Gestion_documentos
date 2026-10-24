import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { HttpErrorResponse } from '@angular/common/http';
import { CompartidosService } from '../../../services/compartidos-service';
import { ErrorService } from '../../../util/services/error-service';
import { CompartidoFila } from '../../../models/documentos/compartido-model';
import { PermisosDialog } from '../../../models/documentos/compartidos-dialog';

@Component({
  selector: 'app-compartidos-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './compartidos-dialog.html',
  styleUrl: './compartidos-dialog.css',
})
export class CompartidosDialog implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(CompartidosService);
  private errorService = inject(ErrorService);
  private dialogRef = inject(MatDialogRef<CompartidosDialog>);
  data = inject<PermisosDialog>(MAT_DIALOG_DATA);

  permisos = ['lectura', 'edicion', 'comentar'];
  compartidos = signal<CompartidoFila[]>([]);
  cargando = signal(false);
  creando = signal(false);

  form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    permiso: ['lectura', Validators.required],
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.api.listar(this.data.recursoTipo, this.data.recursoId).subscribe({
      next: (r) => {
        this.compartidos.set(r.datos);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        const mensaje = error.error.message ?? 'error al cargar los permisos';
        this.errorService.mostrarMensaje(mensaje);
      },
    });
  }

  crear() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { correo, permiso } = this.form.value;
    this.creando.set(true);

    this.api.compartir(this.data.recursoTipo, this.data.recursoId, correo!, permiso!).subscribe({
      next: (fila) => {
        this.compartidos.update((lista) => [...lista, fila]);
        this.form.reset({ correo: '', permiso: 'lectura' });
        this.creando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.creando.set(false);
        const mensaje = error.error.message ?? 'error al compartir el recurso';
        this.errorService.mostrarMensaje(mensaje);
      },
    });
  }

  cambiarPermiso(fila: CompartidoFila, nuevoPermiso: string) {
    if (fila.permiso === nuevoPermiso) return;

    this.api
      .actualizarPermiso(
        this.data.recursoTipo,
        this.data.recursoId,
        fila.usuario_destino_id,
        nuevoPermiso,
      )
      .subscribe({
        next: (actualizada) => {
          this.compartidos.update((lista) =>
            lista.map((c) =>
              c.usuario_destino_id === actualizada.usuario_destino_id ? actualizada : c,
            ),
          );
        },
        error: (error: HttpErrorResponse) => {
          const mensaje = error.error.message ?? 'error al actualizar el permiso';
          this.errorService.mostrarMensaje(mensaje);
        },
      });
  }

  revocar(fila: CompartidoFila) {
    this.api
      .revocar(this.data.recursoTipo, this.data.recursoId, fila.usuario_destino_id)
      .subscribe({
        next: () => {
          this.compartidos.update((lista) =>
            lista.filter((c) => c.usuario_destino_id !== fila.usuario_destino_id),
          );
        },
        error: (error: HttpErrorResponse) => {
          const mensaje = error.error.message ?? 'error al revocar el permiso';
          this.errorService.mostrarMensaje(mensaje);
        },
      });
  }

  cerrar() {
    this.dialogRef.close();
  }
}
