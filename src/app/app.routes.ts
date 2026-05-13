import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AccountTransactions } from './account-transactions/account-transactions';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'accounts/:id/transactions',
    component: AccountTransactions,
  },
];
