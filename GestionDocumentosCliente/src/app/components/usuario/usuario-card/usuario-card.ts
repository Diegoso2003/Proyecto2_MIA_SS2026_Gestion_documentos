import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';

@Component({
  selector: 'app-usuario-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './usuario-card.html',
  styleUrl: './usuario-card.css',
})
export class UsuarioCard {
  usuario = input.required<UsuarioResponse>();
  editar = output<UsuarioResponse>();
  actuEstado = output<UsuarioResponse>();
}
