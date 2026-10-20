import { Routes } from '@angular/router';

export const SIDE_VAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/side-bar/side-bar').then((m) => m.SideBar),
    children: [
      {
        path: 'mis-documentos',
        title: 'mis-documentos',
        loadComponent: () =>
          import('../components/documentos/mis-documentos/mis-documentos').then(
            (m) => m.MisDocumentos,
          ),
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        // canMatch: [guard]
        loadComponent: () =>
          import('../components/usuario/usuarios-vista/usuarios-vista').then(
            (m) => m.UsuariosVista,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'mis-documentos',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'mis-documentos',
  },
];
