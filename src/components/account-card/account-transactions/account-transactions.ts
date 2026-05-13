import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { accounts } from '../data/accounts';
import { Account } from '../../../models/account';
import { Transaction } from '../../../models/transaction';

@Component({
  standalone: true,
  selector: 'app-account-transactions',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-transactions.html',
  styleUrls: ['./account-transactions.css'],
})
export class AccountTransactions {
  protected account?: Account;
  protected searchTerm = '';

  constructor(route: ActivatedRoute) {
    const accountId = Number(route.snapshot.paramMap.get('id'));
    this.account = accounts.find((item) => item.id === accountId);
  }

  protected get filteredTransactions(): Transaction[] {
    if (!this.account?.transactions) return [];
    if (!this.searchTerm.trim()) return this.account.transactions;

    const searchId = parseInt(this.searchTerm.trim());
    if (isNaN(searchId)) return [];

    return this.account.transactions.filter(transaction => transaction.id === searchId);
  }

  protected trackByTransactionId(_index: number, transaction: { id: number }): number {
    return transaction.id;
  }
}
