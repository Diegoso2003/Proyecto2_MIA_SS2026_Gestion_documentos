import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CampoEstado, estadoCampo } from '../../validador-form';

@Component({
  selector: 'app-login-component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private _formBuilder = inject(FormBuilder);
  loginForm: FormGroup = this._formBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    contraseña: ['', Validators.required]
  });
  correoEstado: CampoEstado = estadoCampo(this.loginForm.controls['correo'], {
    required: 'Ingrese su email',
    email: 'Ingrese un email valido'
  })
  passwordEstado: CampoEstado = estadoCampo(this.loginForm.controls['contraseña'], {
    required: 'Ingrese su contraseña'
  })
  private _router = inject(Router);
  mostrarPassword = signal<boolean>(false);

  enviar(): void {}

  clickEvent(event: MouseEvent): void {
    this.mostrarPassword.set(!this.mostrarPassword());
    event.stopPropagation();
  }
}
