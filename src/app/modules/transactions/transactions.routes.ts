import { Routes } from '@angular/router';
import {ListComponent} from './components/list/list.component';

export const transactionsRoutes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
];
