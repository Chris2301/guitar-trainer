import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'learn',
    loadComponent: () => import('./learn/learn').then((m) => m.LearnComponent),
  },
];
