import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/transactions/transactions.routes').then(
        (m) => m.transactionsRoutes,
      ),
  },
];
