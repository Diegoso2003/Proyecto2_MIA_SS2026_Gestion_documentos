import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTree, MatTreeModule } from '@angular/material/tree';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NodoMenu } from '../../models/nodo-menu';
import { REPORTES, SECCIONES } from '../../models/nodo-menu-const';

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
export class SideBar implements AfterViewInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('tree') tree!: MatTree<NodoMenu>;
  readonly secciones = SECCIONES;
  readonly reportes = REPORTES;

  readonly childrenAccessor = (nodo: NodoMenu) => nodo.hijos ?? [];
  readonly tieneHijos = (_: number, nodo: NodoMenu) => !!nodo.hijos?.length;

  ngAfterViewInit(): void {
    this.tree.expand(this.reportes[0]);
  }

  cerrarSesion(): void {
    // TODO: authService.logout() y redirigir a /login
  }
}
