import { DatePipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JwtService } from '../../../util/services/jwt-service';
import { ErrorService } from '../../../util/services/error-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ComentarioService } from '../../../services/comentario-service';
import { ComentarioVistaModel } from '../../../models/documentos/documento_model';

@Component({
  selector: 'app-sidebar-comentarios',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    MatTooltipModule,
  ],
  templateUrl: './sidebar-comentarios.html',
  styleUrl: './sidebar-comentarios.css',
  host: { class: 'flex flex-col h-full' },
})
export class SidebarComentarios {
  documentoId = input.required<string>();
  puedeComentar = input(false);
  cerrar = output<void>();

  private _comentarioService = inject(ComentarioService);
  private _jwtService = inject(JwtService);
  private _errorInfo = inject(ErrorService);

  miId = this._jwtService.getIdUsuario();

  comentariosResource = rxResource({
    params: () => ({ id: this.documentoId() }),
    stream: ({ params }) => this._comentarioService.listarPorDocumento(params.id),
  });

  nuevoComentario = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });

  editandoId = signal<string | null>(null);
  textoEdicion = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(/\S/)],
  });

  constructor() {
    effect(() => {
      if (this.puedeComentar()) this.nuevoComentario.enable();
      else this.nuevoComentario.disable();
    });

    effect(() => {
      const error = this.comentariosResource.error();
      if (error) {
        this._errorInfo.mostrarMensaje(
          (error as HttpErrorResponse).error?.message ?? 'Error al obtener los comentarios',
        );
      }
    });
  }

  private mostrarError(e: HttpErrorResponse, defecto: string): void {
    this._errorInfo.mostrarMensaje(e.error?.message ?? defecto);
  }

  enviar(): void {
    if (this.nuevoComentario.invalid) return;
    this._comentarioService.crear(this.documentoId(), this.nuevoComentario.value).subscribe({
      next: () => {
        this.nuevoComentario.reset();
        this.comentariosResource.reload();
      },
      error: (e: HttpErrorResponse) => this.mostrarError(e, 'Error al comentar'),
    });
  }

  iniciarEdicion(c: ComentarioVistaModel): void {
    this.editandoId.set(c._id);
    this.textoEdicion.setValue(c.texto);
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  guardarEdicion(c: ComentarioVistaModel): void {
    if (this.textoEdicion.invalid) return;
    this._comentarioService.editar(c._id, this.textoEdicion.value).subscribe({
      next: () => {
        this.editandoId.set(null);
        this.comentariosResource.reload();
      },
      error: (e: HttpErrorResponse) => this.mostrarError(e, 'Error al editar el comentario'),
    });
  }
}
