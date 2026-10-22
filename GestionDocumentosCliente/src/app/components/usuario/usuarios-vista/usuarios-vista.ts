import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioBusqueda } from '../usuario-busqueda/usuario-busqueda';
import { UsuarioCard } from '../usuario-card/usuario-card';
import { UsuarioService } from '../../../services/usuario-service';
import { MatDialog } from '@angular/material/dialog';
import { FILTRO_USUARIO_VACIO, UsuarioFiltro } from '../../../models/usuario/usuario-filtro';
import { UsuarioCreateModal } from '../usuario-create-modal/usuario-create-modal';
import { UsuarioResponse } from '../../../models/usuario/usuario-response';
import { UsuarioActuModal } from '../usuario-actu-modal/usuario-actu-modal';
import { ErrorService } from '../../../util/services/error-service';
import { UsuarioActuEstado } from '../../../models/usuario/usuario-actu-request';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioFiltroDialog } from '../usuario-filtro-dialog/usuario-filtro-dialog';
import { JwtService } from '../../../util/services/jwt-service';

@Component({
  selector: 'app-usuarios-vista',
  imports: [MatButtonModule, MatIconModule, UsuarioBusqueda, UsuarioCard],
  templateUrl: './usuarios-vista.html',
  styleUrl: './usuarios-vista.css',
})
export class UsuariosVista implements OnInit {
  private _usuarioService = inject(UsuarioService);
  private _errorService = inject(ErrorService);
  private dialog = inject(MatDialog);
  private _jwtService = inject(JwtService);
  usuarioId = signal<string>('');
  usuarios = signal<UsuarioResponse[]>([]);
  filtrosActivos = computed(() => Object.values(this.filtros()).filter((v) => v !== null).length);

  busqueda = signal('');
  filtros = signal<UsuarioFiltro>(FILTRO_USUARIO_VACIO);

  ngOnInit(): void {
    this.traerUsuarios();
  }

  traerUsuarios(): void {
    this._usuarioService.obtenerUsuarios(this.filtros()).subscribe({
      next: (usuarios: UsuarioResponse[]) => {
        this.usuarios.set(usuarios);
        this.usuarioId.set(this._jwtService.getIdUsuario());
      },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error.message ?? 'error al traer a los usuarios intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }
  abrirCrear(): void {
    this.dialog
      .open<UsuarioCreateModal, any, boolean>(UsuarioCreateModal, {
        width: '480px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((valor) => {
        if (valor) {
          console.log('creado');
          this.traerUsuarios();
        }
      });
  }

  abrirFiltros() {
    this.dialog
      .open<UsuarioFiltroDialog, UsuarioFiltro, UsuarioFiltro>(UsuarioFiltroDialog, {
        data: this.filtros(),
        width: '440px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((filtrosDelDialogo) => {
        if (filtrosDelDialogo) {
          this.filtros.set(filtrosDelDialogo);
          this.traerUsuarios();
        }
      });
  }

  abrirEditar(usuario: UsuarioResponse): void {
    this.dialog
      .open<UsuarioActuModal, UsuarioResponse, boolean>(UsuarioActuModal, {
        data: usuario,
        width: '480px',
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe((resultado) => {
        if (resultado) {
          this.traerUsuarios();
        }
      });
  }

  cambiarEstado(usuario: UsuarioResponse): void {
    const actu: UsuarioActuEstado = {
      estado: !usuario.activo,
    };
    this._usuarioService.actuEstadoUsuario(usuario._id, actu).subscribe({
      next: () => {
        this.traerUsuarios();
      },
      error: (error: HttpErrorResponse) => {
        const mensaje = error.error.message ?? 'error al actualizar al usuario intente más tarde';
        this._errorService.mostrarMensaje(mensaje);
      },
    });
  }
  buscarNombre(nombre: string) {
    this.busqueda.set(nombre);
    this.filtros.update((filtros) => ({
      ...filtros,
      nombre,
    }));
    this.traerUsuarios();
  }
}
