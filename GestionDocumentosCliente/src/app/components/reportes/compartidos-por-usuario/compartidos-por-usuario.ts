import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ReporteComparticionesUsuario } from '../../../models/reportes/reporte-comparticion-usuario';
import { UsuarioService } from '../../../services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compartidos-por-usuario',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './compartidos-por-usuario.html',
  styleUrl: './compartidos-por-usuario.css',
})
export class CompartidosPorUsuario implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');
  private usuarioService = inject(UsuarioService);

  columnas = [
    'recurso_tipo',
    'nombre_recurso',
    'contraparte_nombre',
    'contraparte_correo',
    'permiso',
    'createdAt',
  ];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteComparticionesUsuario | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    usuarioId: ['', Validators.required],
    recursoTipo: [''],
    permiso: [''],
  });

  ngOnInit() {
    this.usuarioService
      .obtenerUsuarios({ rol: null, estado: null, correo: null, nombre: null })
      .subscribe({
        next: (usuarios: UsuarioResponse[]) => {
          this.usuarios.set(usuarios);
        },
        error: (error: HttpErrorResponse) => {
          const mensaje = error.error.message ?? 'error al obtener los usuarios';
          this.errorService.mostrarMensaje(mensaje);
        },
      });
  }

  consultar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.value;

    const params: Record<string, string> = {
      usuarioId: valor.usuarioId ?? '',
    };
    if (valor.recursoTipo) params['recursoTipo'] = valor.recursoTipo;
    if (valor.permiso) params['permiso'] = valor.permiso;

    this.cargando.set(true);

    this.api.compartidosPorUsuario(params).subscribe({
      next: (r) => {
        this.respuesta.set(r);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.respuesta.set(null);
        const mensaje = error.error.message ?? 'error al obtener el reporte';
        this.errorService.mostrarMensaje(mensaje);
      },
    });
  }

  limpiar() {
    this.form.reset({
      usuarioId: '',
      recursoTipo: '',
      permiso: '',
    });
    this.respuesta.set(null);
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy HH:mm') ?? '—';
  }
}
