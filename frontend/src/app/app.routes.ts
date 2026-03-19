import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'learn',
    loadChildren: () => import('./learn/learn.routes').then((m) => m.learnRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
