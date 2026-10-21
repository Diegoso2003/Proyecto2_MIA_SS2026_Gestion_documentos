import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UsuarioService } from '../../../services/usuario-service';
import { Rol, ROLES } from '../../../models/usuario/usuario-response';
import { CampoEstado, estadoCampo } from '../../../util/validador-form';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioCreateRequest } from '../../../models/usuario/usuario-create-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-create-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './usuario-create-modal.html',
  styleUrl: './usuario-create-modal.css',
})
export class UsuarioCreateModal {
  private _fb = inject(NonNullableFormBuilder);
  private _usuarioService = inject(UsuarioService);
  private ref = inject<MatDialogRef<UsuarioCreateModal, boolean>>(MatDialogRef);
  private _errorService = inject(ErrorService);
  roles = ROLES;
  mostrarPassword = signal(false);
  cargando = signal(false);
  form = this._fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    rol: ['usuario' as Rol, [Validators.required]],
    contraseña: ['', [Validators.required, Validators.minLength(8)]],
  });
  nombreEstado: CampoEstado = estadoCampo(this.form.controls.nombre, {
    required: 'El nombre es obligatorio',
    minLength: 'Minimo 3 caracteres',
  });
  correoEstado: CampoEstado = estadoCampo(this.form.controls.correo, {
    required: 'El correo es obligatorio',
    email: 'Ingrese un correo valido',
  });
  rolEstado: CampoEstado = estadoCampo(this.form.controls.rol, {
    required: 'Seleccione un rol',
  });
  passwordEstado: CampoEstado = estadoCampo(this.form.controls.contraseña, {
    required: 'La contraseña es obligatoria',
    minLength: 'Minimo 8 caracteres',
  });

  alternarPassword(event: MouseEvent): void {
    this.mostrarPassword.update((valor) => !valor);
    event.stopPropagation();
  }

  crear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._errorService.mostrarMensaje('ingrese los datos correctamente');
      return;
    }
    this.cargando.set(true);
    this._usuarioService.crearUsuario(this.form.getRawValue() as UsuarioCreateRequest).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        const mensaje = error.error.message ?? 'error al crear al usuario intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }
}
