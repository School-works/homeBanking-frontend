import { Routes } from '@angular/router';
import { Home } from '../components/account-card/home/home';
import { AccountTransactions } from '../components/account-card/account-transactions/account-transactions';

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
