import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ReporteArchivosMasCompartidos } from '../../../models/reportes/archivo-mas-compartido';

@Component({
  selector: 'app-archivos-mas-compartidos',
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
  templateUrl: './archivos-mas-compartidos.html',
  styleUrl: './archivos-mas-compartidos.css',
})
export class ArchivosMasCompartidos implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);
  private datePipe = new DatePipe('en-US');

  columnas = [
    'posicion',
    'nombre',
    'extension',
    'propietario',
    'cantidad_usuarios',
    'ultima_comparticion',
  ];

  respuesta = signal<ReporteArchivosMasCompartidos | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    permiso: [''],
    desde: [''],
    hasta: [''],
    limite: [10],
  });

  ngOnInit() {
    this.consultar();
  }

  consultar() {
    const valor = this.form.value;

    const params: Record<string, string | number> = {};
    if (valor.permiso) params['permiso'] = valor.permiso;
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;
    if (valor.limite != null) params['limite'] = valor.limite;

    this.cargando.set(true);

    this.api.archivosMasCompartidos(params).subscribe({
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
      permiso: '',
      desde: '',
      hasta: '',
      limite: 10,
    });
    this.respuesta.set(null);
    this.consultar();
  }

  formatearFecha(valor: string): string {
    return this.datePipe.transform(valor, 'dd/MM/yyyy') ?? '—';
  }
}
