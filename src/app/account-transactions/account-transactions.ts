import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { accounts } from '../data/accounts';
import { Account } from '../../models/account';

@Component({
  standalone: true,
  selector: 'app-account-transactions',
  imports: [CommonModule, RouterModule],
  templateUrl: './account-transactions.html',
  styleUrls: ['./account-transactions.css'],
})
export class AccountTransactions {
  protected account?: Account;

  constructor(route: ActivatedRoute) {
    const accountId = Number(route.snapshot.paramMap.get('id'));
    this.account = accounts.find((item) => item.id === accountId);
  }

  protected trackByTransactionId(_index: number, transaction: { id: number }): number {
    return transaction.id;
  }
}
