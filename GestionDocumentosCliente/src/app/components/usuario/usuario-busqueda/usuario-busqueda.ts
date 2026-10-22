import { Component, input, output, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-usuario-busqueda',
  imports: [MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './usuario-busqueda.html',
  styleUrl: './usuario-busqueda.css',
})
export class UsuarioBusqueda {
  filtrosActivos = input(0);
  buscar = output<string>();
  abrirFiltros = output<void>();
  texto = signal('');

  enviar(e: Event) {
    e.preventDefault();
    this.buscar.emit(this.texto());
  }

  limpiar() {
    this.texto.set('');
  }
}
