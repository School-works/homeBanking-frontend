import { Routes } from '@angular/router';
import { Home } from '../components/account-card/home/home';
import { AccountTransactions } from '../components/account-card/account-transactions/account-transactions';
import { Balance } from '../components/account-card/balance/balance';
import { Deposit } from '../components/account-card/deposit/deposit';
import { Withdrawal } from '../components/account-card/withdrawal/withdrawal';
import { Convert } from '../components/account-card/convert/convert';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'accounts/:id/transactions', component: AccountTransactions },
  { path: 'accounts/:id/balance',      component: Balance },
  { path: 'accounts/:id/deposit',      component: Deposit },
  { path: 'accounts/:id/withdrawal',   component: Withdrawal },
  { path: 'accounts/:id/convert',      component: Convert },
];