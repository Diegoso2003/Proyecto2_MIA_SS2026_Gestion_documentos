import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { ReporteService } from '../../../services/reporte-service';
import { ErrorService } from '../../../util/services/error-service';
import { ReportePrincipalesAcciones } from '../../../models/reportes/principales-acciones';

@Component({
  selector: 'app-principales-acciones-component',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    DecimalPipe,
  ],
  templateUrl: './principales-acciones-component.html',
  styleUrl: './principales-acciones-component.css',
})
export class PrincipalesAccionesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');

  columnas = ['posicion', 'accion', 'cantidad', 'porcentaje', 'ultima_vez'];

  respuesta = signal<ReportePrincipalesAcciones | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    desde: [''],
    hasta: [''],
    limite: [5],
  });

  ngOnInit() {
    this.consultar();
  }

  consultar() {
    const valor = this.form.value;

    const params: Record<string, string | number> = {};
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.limite != null) params['limite'] = valor.limite;

    this.cargando.set(true);

    this.api.principalesAcciones(params).subscribe({
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
      limite: 5,
    });
    this.respuesta.set(null);
    this.consultar();
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy HH:mm') ?? '—';
  }
}
