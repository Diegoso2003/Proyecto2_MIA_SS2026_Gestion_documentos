import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioService } from '../../../services/usuario-service';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { ReporteHistorialUsuario } from '../../../models/reportes/historial-usuario';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-historial-usuario',
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
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './historial-usuario.html',
  styleUrl: './historial-usuario.css',
})
export class HistorialUsuario implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private usuarioService = inject(UsuarioService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');

  columnas = ['createdAt', 'accion', 'descripcion'];

  acciones = [
    'crear_carpeta',
    'subir',
    'compartir',
    'modificar_permiso',
    'revocar_permiso',
    'comentar',
    'descargar',
    'renombrar',
    'mover',
    'eliminar',
    'eliminar_permanente',
    'restaurar',
  ];

  usuarios = signal<UsuarioResponse[]>([]);
  respuesta = signal<ReporteHistorialUsuario | null>(null);
  cargando = signal(false);
  pageSize = 20;

  form = this.fb.group({
    usuarioId: ['', Validators.required],
    desde: [''],
    hasta: [''],
    accion: [''],
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

  consultar(pageIndex: number) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.value;

    const params: Record<string, string | number> = {
      usuarioId: valor.usuarioId ?? '',
      page: pageIndex + 1,
      limit: this.pageSize,
    };
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.accion) params['accion'] = valor.accion;

    this.cargando.set(true);

    this.api.historialUsuario(params).subscribe({
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
      usuarioId: '',
      desde: '',
      hasta: '',
      accion: '',
    });
    this.respuesta.set(null);
  }

  /** La "última actividad" viene como ISO; el resto es número. */
  formatearResumen(item: { etiqueta: string; valor: string | number }): string | number {
    if (
      item.etiqueta === 'Última actividad' &&
      typeof item.valor === 'string' &&
      item.valor !== '—'
    ) {
      return this.formatearFecha(item.valor);
    }
    return item.valor;
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy HH:mm') ?? '—';
  }
}
