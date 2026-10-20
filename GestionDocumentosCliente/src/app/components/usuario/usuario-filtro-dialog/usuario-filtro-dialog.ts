import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FILTRO_USUARIO_VACIO, UsuarioFiltro } from '../../../models/usuario/usuario-filtro';
import { Rol } from '../../../models/usuario/usuario-response';

@Component({
  selector: 'app-usuario-filtro-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './usuario-filtro-dialog.html',
  styleUrl: './usuario-filtro-dialog.css',
})
export class UsuarioFiltroDialog {
  private fb = inject(NonNullableFormBuilder);
  private ref = inject<MatDialogRef<UsuarioFiltroDialog, UsuarioFiltro>>(MatDialogRef);
  private actuales = inject<UsuarioFiltro>(MAT_DIALOG_DATA);
  roles = Object.keys(Rol);

  form = this.fb.group({
    rol: this.fb.control<Rol | null>(this.actuales.rol),
    estado: this.fb.control<boolean | null>(this.actuales.estado),
    correo: this.fb.control<string | null>(this.actuales.correo, [Validators.email]),
  });

  restablecer(): void {
    this.form.reset(FILTRO_USUARIO_VACIO);
  }

  aplicar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const nuevoFiltro = this.form.getRawValue() as UsuarioFiltro;
    if (nuevoFiltro.correo === '') {
      nuevoFiltro.correo = null;
    }
    this.ref.close(nuevoFiltro);
  }
}
