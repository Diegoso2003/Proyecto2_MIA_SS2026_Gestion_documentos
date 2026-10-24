import { Routes } from '@angular/router';

export const REPORTES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/side-bar/side-bar').then((m) => m.SideBar),
    children: [
      {
        path: 'archivos-tipo',
        title: 'archivos-tipo',
        loadComponent: () =>
          import('../components/reportes/archivos-por-tipo/archivos-por-tipo').then(
            (m) => m.ArchivosPorTipo,
          ),
      },
      {
        path: 'archivos-fechas',
        title: 'archivos-fechas',
        loadComponent: () =>
          import('../components/reportes/archivos-por-rango/archivos-por-rango').then(
            (m) => m.ArchivosPorRango,
          ),
      },
      {
        path: 'archivos-operaciones',
        title: 'archivos-operaciones',
        loadComponent: () =>
          import('../components/reportes/archivos-mas-operaciones/archivos-mas-operaciones').then(
            (m) => m.ArchivosMasOperaciones,
          ),
      },
      {
        path: 'usuarios-top',
        title: 'usuarios-top',
        loadComponent: () =>
          import('../components/reportes/top-usuarios-archivos/top-usuarios-archivos').then(
            (m) => m.TopUsuariosArchivos,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'archivos-tipo',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'archivos-tipo',
  },
];
