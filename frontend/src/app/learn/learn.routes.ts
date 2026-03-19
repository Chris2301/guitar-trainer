import { Routes } from '@angular/router';

export const learnRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./learn').then((m) => m.LearnComponent),
  },
  {
    path: 'fretboard-flash',
    loadComponent: () =>
      import('./fretboard-flash/fretboard-flash-page/fretboard-flash-page').then(
        (m) => m.FretboardFlashPageComponent,
      ),
  },
];
