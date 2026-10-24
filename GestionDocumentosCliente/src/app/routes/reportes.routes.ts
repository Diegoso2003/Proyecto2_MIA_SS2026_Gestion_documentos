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
