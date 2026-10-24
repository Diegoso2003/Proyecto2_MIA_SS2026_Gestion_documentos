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
import { ReporteTopUsuariosArchivos } from '../../../models/reportes/top-usuarios-archivos';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-top-usuarios-archivos',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressBarModule,
    DecimalPipe,
  ],
  templateUrl: './top-usuarios-archivos.html',
  styleUrl: './top-usuarios-archivos.css',
})
export class TopUsuariosArchivos implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);

  columnas = ['posicion', 'nombre', 'correo', 'cantidad_archivos', 'tamano_total'];

  respuesta = signal<ReporteTopUsuariosArchivos | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    extension: [''],
    desde: [''],
    hasta: [''],
    incluirEliminados: [false],
  });

  ngOnInit() {
    this.consultar();
  }

  consultar() {
    const valor = this.form.value;

    const params: Record<string, string | boolean> = {};
    if (valor.extension) params['extension'] = valor.extension;
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.incluirEliminados) params['incluirEliminados'] = true;
    this.cargando.set(true);

    this.api.topUsuariosArchivos(params).subscribe({
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
      extension: '',
      desde: '',
      hasta: '',
      incluirEliminados: false,
    });
    this.respuesta.set(null);
    this.consultar();
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
