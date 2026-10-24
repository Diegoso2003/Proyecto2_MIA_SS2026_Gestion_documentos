import { Routes } from '@angular/router';
import { AdminGuard } from '../guards/admin-guard';

export const SIDE_VAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/side-bar/side-bar').then((m) => m.SideBar),
    children: [
      {
        path: 'mis-documentos/:id',
        title: 'mis-documentos',
        loadComponent: () =>
          import('../components/documentos/mis-documentos/mis-documentos').then(
            (m) => m.MisDocumentos,
          ),
      },
      {
        path: 'mis-documentos',
        title: 'Mis documentos',
        loadComponent: () =>
          import('../components/documentos/mis-documentos/mis-documentos').then(
            (m) => m.MisDocumentos,
          ),
      },
      {
        path: 'papelera',
        title: 'Papelera',
        loadComponent: () =>
          import('../components/documentos/papelera/papelera').then((m) => m.Papelera),
      },
      {
        path: 'compartidos',
        title: 'Compartidos',
        loadComponent: () =>
          import('../components/documentos/compartidos/compartidos').then((m) => m.Compartidos),
      },
      {
        path: 'compartidos/:id',
        title: 'Compartidos',
        loadComponent: () =>
          import('../components/documentos/compartidos/compartidos').then((m) => m.Compartidos),
      },
      {
        path: 'documento/:id',
        title: 'Documento',
        loadComponent: () =>
          import('../components/documentos/documento-vista/documento-vista').then(
            (m) => m.DocumentoVista,
          ),
      },
      {
        path: 'usuarios',
        title: 'Usuarios',
        canMatch: [AdminGuard],
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
