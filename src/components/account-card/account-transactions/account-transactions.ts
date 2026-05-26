import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';
import { BankingService, Account, Transaction } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-transactions',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account-transactions.html',
  styleUrls: ['./account-transactions.css'],
})
export class AccountTransactions implements OnInit, OnDestroy {
  protected account?: Account;
  protected transactions: Transaction[] = [];
  protected balance = 0;
  protected searchTerm = '';
  protected loading = true;
  protected error: string | null = null;

  private accountId!: number;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private banking: BankingService,
    private cdr: ChangeDetectorRef,
  ) {
    // Legge l'ID del conto dall'URL (es. /accounts/3/transactions)
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.load();
  }

  // Carica conto, transazioni e saldo in parallelo
  protected load(): void {
    this.loading = true;
    this.error = null;
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];

    const sub = forkJoin({
      account: this.banking.getAccount(this.accountId),
      transactions: this.banking.getTransactions(this.accountId),
      balanceData: this.banking.getBalance(this.accountId),
    }).subscribe({
      next: ({ account, transactions, balanceData }) => {
        this.account = account;
        this.transactions = transactions;
        this.balance = balanceData.balance;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento delle transazioni:', err);
        this.error = 'Impossibile caricare i dati del conto.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // Filtra le transazioni per ID (campo di ricerca)
  protected get filteredTransactions(): Transaction[] {
    if (!this.searchTerm.trim()) return this.transactions;
    const searchId = parseInt(this.searchTerm.trim());
    if (isNaN(searchId)) return [];
    return this.transactions.filter((t) => t.id === searchId);
  }

  // Il DB salva l'importo sempre positivo; il tipo determina il segno
  protected signedAmount(t: Transaction): number {
    return t.type === 'withdrawal' ? -Math.abs(t.amount) : Math.abs(t.amount);
  }

  protected trackByTransactionId(_index: number, t: Transaction): number {
    return t.id;
  }
}