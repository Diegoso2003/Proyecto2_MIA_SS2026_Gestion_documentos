import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ReporteArchivosPorRango } from '../../../models/reportes/reporte-rango-fecha';
import { UsuarioService } from '../../../services/usuario-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-archivos-por-rango',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './archivos-por-rango.html',
  styleUrl: './archivos-por-rango.css',
})
export class ArchivosPorRango implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');
  private usuarioService = inject(UsuarioService);

  columnas = ['nombre', 'extension', 'tamano_bytes', 'propietario', 'createdAt'];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteArchivosPorRango | null>(null);
  cargando = signal(false);
  pageSize = 20;

  form = this.fb.group({
    desde: [''],
    hasta: [''],
    extension: [''],
    propietarioId: [''],
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
    this.consultar(0);
  }

  consultar(pageIndex: number) {
    const valor = this.form.value;

    const params: Record<string, string | number> = {
      page: pageIndex + 1,
      limit: this.pageSize,
    };
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.extension) params['extension'] = valor.extension;
    if (valor.propietarioId) params['propietarioId'] = valor.propietarioId;

    this.cargando.set(true);

    this.api.archivosPorRangoFechas(params).subscribe({
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

  cambiarPagina(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.consultar(e.pageIndex);
  }

  limpiar() {
    this.form.reset({
      desde: '',
      hasta: '',
      extension: '',
      propietarioId: '',
    });
    this.respuesta.set(null);
    this.consultar(0);
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy HH:mm') ?? '—';
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
