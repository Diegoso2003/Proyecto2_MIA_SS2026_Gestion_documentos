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
import { ReporteUsuariosMasCompartidos } from '../../../models/reportes/reporte-mas-compartidos';

@Component({
  selector: 'app-usuarios-mas-compartidos',
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
  templateUrl: './usuarios-mas-compartidos.html',
  styleUrl: './usuarios-mas-compartidos.css',
})
export class UsuariosMasCompartidos implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ReporteService);
  private errorService = inject(ErrorService);

  columnas = [
    'posicion',
    'nombre',
    'correo',
    'recursos_distintos',
    'total_comparticiones',
    'usuarios_destino',
  ];

  respuesta = signal<ReporteUsuariosMasCompartidos | null>(null);
  cargando = signal(false);

  form = this.fb.group({
    recursoTipo: [''],
    permiso: [''],
    desde: [''],
    hasta: [''],
  });

  ngOnInit() {
    this.consultar();
  }

  consultar() {
    const valor = this.form.value;

    const params: Record<string, string> = {};
    if (valor.recursoTipo) params['recursoTipo'] = valor.recursoTipo;
    if (valor.permiso) params['permiso'] = valor.permiso;
    if (valor.desde) params['desde'] = valor.desde;
    if (valor.hasta) params['hasta'] = valor.hasta;

    this.cargando.set(true);

    this.api.usuariosMasCompartidos(params).subscribe({
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
      recursoTipo: '',
      permiso: '',
      desde: '',
      hasta: '',
    });
    this.respuesta.set(null);
    this.consultar();
  }
}
