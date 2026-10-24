import { DatePipe, DecimalPipe } from '@angular/common';
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
import { ReporteActividadPorTipo } from '../../../models/reportes/actividad-por-tipo';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioService } from '../../../services/usuario-service';

@Component({
  selector: 'app-historial-por-tipo',
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
  templateUrl: './historial-por-tipo.html',
  styleUrl: './historial-por-tipo.css',
})
export class HistorialPorTipo implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private usuarioService = inject(UsuarioService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');

  columnas = ['accion', 'cantidad', 'porcentaje', 'usuarios_distintos', 'ultima_vez'];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteActividadPorTipo | null>(null);
  cargando = signal(false);

  form = this.fb.group({
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

    const params: Record<string, string> = {};
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.usuarioId) params['usuarioId'] = valor.usuarioId;

    this.cargando.set(true);

    this.api.actividadPorTipo(params).subscribe({
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
      desde: '',
      hasta: '',
      usuarioId: '',
    });
    this.respuesta.set(null);
    this.consultar();
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy HH:mm') ?? '—';
  }
}
