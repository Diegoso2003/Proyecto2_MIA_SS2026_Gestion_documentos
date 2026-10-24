import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ReporteArchivosPorTipo } from '../../../models/reportes/reporte-response';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioService } from '../../../services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-archivos-por-tipo',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    DecimalPipe,
  ],
  templateUrl: './archivos-por-tipo.html',
  styleUrl: './archivos-por-tipo.css',
})
export class ArchivosPorTipo implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private usuarioService = inject(UsuarioService);

  columnas = ['extension', 'tipo_mime', 'cantidad', 'tamano_total', 'tamano_promedio'];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteArchivosPorTipo | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    propietarioId: [''],
    desde: [''],
    hasta: [''],
    incluirEliminados: [false],
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

    const params: Record<string, string | boolean> = {};
    if (valor.propietarioId) params['propietarioId'] = valor.propietarioId;
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.incluirEliminados) params['incluirEliminados'] = true;

    this.cargando.set(true);
    this.error.set(null);

    this.api.archivosPorTipo(params).subscribe({
      next: (r) => {
        this.respuesta.set(r);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.respuesta.set(null);
        const mensaje = error.error.message ?? 'error al obtener los usuarios';
        this.errorService.mostrarMensaje(mensaje);
      },
    });
  }

  limpiar() {
    this.form.reset({
      propietarioId: '',
      desde: '',
      hasta: '',
      incluirEliminados: false,
    });
    this.respuesta.set(null);
    this.error.set(null);
  }

  formatearBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    const unidades = ['KB', 'MB', 'GB', 'TB'];
    let valor = bytes / 1024;
    let i = 0;
    while (valor >= 1024 && i < unidades.length - 1) {
      valor /= 1024;
      i++;
    }
    return `${valor.toFixed(1)} ${unidades[i]}`;
  }
}
