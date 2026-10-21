import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CampoEstado, estadoCampo } from '../../validador-form';
import { AuthService } from '../../services/auth-service';
import { ErrorService } from '../../services/error-service';
import { LoginDTO } from '../../models/login-dto';
import { JwtToken } from '../../models/jwt-token';
import { HttpErrorResponse } from '@angular/common/http';
import { JwtService } from '../../services/jwt-service';

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
    contraseña: ['', Validators.required],
  });
  correoEstado: CampoEstado = estadoCampo(this.loginForm.controls['correo'], {
    required: 'Ingrese su email',
    email: 'Ingrese un email valido',
  });
  passwordEstado: CampoEstado = estadoCampo(this.loginForm.controls['contraseña'], {
    required: 'Ingrese su contraseña',
  });
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _errorService = inject(ErrorService);
  private _jwtService = inject(JwtService);
  mostrarPassword = signal<boolean>(false);

  enviar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this._errorService.mostrarMensaje('ingrese los datos correctamente');
      return;
    }
    const login = this.loginForm.value as LoginDTO;
    this._authService.login(login).subscribe({
      next: (token: JwtToken) => {
        this._jwtService.guardarToken(token);
        this._router.navigate(['inicio/mis-documentos']);
      },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error.message ?? 'intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }

  clickEvent(event: MouseEvent): void {
    this.mostrarPassword.set(!this.mostrarPassword());
    event.stopPropagation();
  }
}
