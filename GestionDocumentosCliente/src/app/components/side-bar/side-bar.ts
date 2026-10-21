import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NodoMenu } from '../../models/nodo-menu';
import { REPORTES, SECCIONES, USUARIOS } from '../../models/nodo-menu-const';
import { JwtService } from '../../util/services/jwt-service';
import { Rol } from '../../models/usuario/usuario-response';

@Component({
  selector: 'app-side-bar',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('tree') tree!: MatTree<NodoMenu>;
  readonly secciones = SECCIONES;
  readonly reportes = REPORTES;
  readonly usuarios = USUARIOS;
  private _jwtService = inject(JwtService);
  private _router = inject(Router);
  usuarioAdmin = signal(false);

  readonly childrenAccessor = (nodo: NodoMenu) => nodo.hijos ?? [];
  readonly tieneHijos = (_: number, nodo: NodoMenu) => !!nodo.hijos?.length;

  ngOnInit(): void {
    const rol = this._jwtService.getRol();
    this.usuarioAdmin.set(rol === Rol.ADMIN);
  }
  cerrarSesion(): void {
    this._jwtService.logout();
    this._router.navigate(['/login']);
  }
}
