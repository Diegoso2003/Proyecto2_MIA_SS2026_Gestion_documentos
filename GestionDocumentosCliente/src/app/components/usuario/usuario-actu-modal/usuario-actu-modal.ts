import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Rol, UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioService } from '../../../services/usuario-service';
import { CampoEstado, estadoCampo } from '../../../util/validador-form';
import {
  UsuarioActuPassword,
  UsuarioActuRequest,
} from '../../../models/usuario/usuario-actu-request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-actu-modal',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButton,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './usuario-actu-modal.html',
  styleUrl: './usuario-actu-modal.css',
})
export class UsuarioActuModal {
  private fb = inject(NonNullableFormBuilder);
  private _usuarioService = inject(UsuarioService);
  private ref = inject<MatDialogRef<UsuarioActuModal, boolean>>(MatDialogRef);
  private _errorService = inject(ErrorService);
  usuario = inject<UsuarioResponse>(MAT_DIALOG_DATA);
  roles = Object.values(Rol);
  mostrarPassword = signal(false);
  cargandoDatos = signal(false);
  cargandoPassword = signal(false);

  form = this.fb.group({
    nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
    correo: [this.usuario.correo, [Validators.required, Validators.email]],
    rol: [this.usuario.rol as Rol, Validators.required],
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

  passwordForm = this.fb.group({
    contraseña: ['', [Validators.required, Validators.minLength(8)]],
  });

  passwordEstado: CampoEstado = estadoCampo(this.passwordForm.controls.contraseña, {
    required: 'La contraseña es obligatoria',
    minLength: 'Minimo 8 caracteres',
  });

  alternarPassword(event: MouseEvent): void {
    this.mostrarPassword.update((valor) => !valor);
    event.stopPropagation();
  }

  actualizar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._errorService.mostrarMensaje('ingrese correctamente los datos solicitados');
      return;
    }
    this.cargandoDatos.set(true);
    const datos: UsuarioActuRequest = { ...this.form.getRawValue(), _id: this.usuario._id };
    this._usuarioService.actualizarUsuario(datos).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.cargandoDatos.set(false);
        const mensaje = error.error.message ?? 'error al actualizar intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }

  actualizarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this._errorService.mostrarMensaje('ingrese la contraseña correctamente');
      return;
    }
    this.cargandoPassword.set(true);
    const actu: UsuarioActuPassword = { ...this.passwordForm.getRawValue(), _id: this.usuario._id };
    this._usuarioService.actuPasswordUsuario(actu).subscribe({
      next: () => {
        this.ref.close(true);
      },
      error: (error: HttpErrorResponse) => {
        this.cargandoPassword.set(false);
        const mensaje = error.error.message ?? 'error al actualizar contraseña intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }
}
