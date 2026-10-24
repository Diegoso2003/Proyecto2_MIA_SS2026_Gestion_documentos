import { DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ReporteActividadPorPeriodo } from '../../../models/reportes/actividad-por-periodo';
import { UsuarioService } from '../../../services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-actividad-por-periodo',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    DecimalPipe,
  ],
  templateUrl: './actividad-por-periodo.html',
  styleUrl: './actividad-por-periodo.css',
})
export class ActividadPorPeriodo implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private usuarioService = inject(UsuarioService);

  columnas = ['periodo', 'cantidad', 'usuarios_distintos'];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteActividadPorPeriodo | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    periodo: ['dia'],
    desde: [''],
    hasta: [''],
    usuarioId: [''],
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
    this.consultar();
  }

  consultar() {
    const valor = this.form.value;

    const params: Record<string, string> = {
      periodo: valor.periodo ?? 'dia',
    };
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.usuarioId) params['usuarioId'] = valor.usuarioId;

    this.cargando.set(true);

    this.api.actividadPorPeriodo(params).subscribe({
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
      periodo: 'dia',
      desde: '',
      hasta: '',
      usuarioId: '',
    });
    this.respuesta.set(null);
    this.consultar();
  }
}
