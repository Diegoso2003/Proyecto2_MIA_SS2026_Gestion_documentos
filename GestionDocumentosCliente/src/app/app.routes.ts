import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    //canActivate: [AuthGuard],
    title: 'Login',
    loadComponent: () =>
      import('./util/components/login-component/login-component').then((m) => m.LoginComponent),
  },
  {
    path: 'homeeeeeeeeee',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
