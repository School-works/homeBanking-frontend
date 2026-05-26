import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankingService, Account, BalanceData } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-balance',
  imports: [CommonModule, RouterModule],
  templateUrl: './balance.html',
  styleUrls: ['./balance.css'],
})
export class Balance implements OnInit, OnDestroy {
  protected account?: Account;
  protected balanceData?: BalanceData;
  protected loading = true;
  protected error: string | null = null;

  private accountId!: number;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private banking: BankingService,
    private cdr: ChangeDetectorRef,
  ) {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    // Carica il conto e il saldo in parallelo
    const s1 = this.banking.getAccount(this.accountId).subscribe({
      next: (account) => { this.account = account; this.cdr.detectChanges(); },
      error: () => { this.error = 'Impossibile caricare il conto.'; this.loading = false; this.cdr.detectChanges(); },
    });

    const s2 = this.banking.getBalance(this.accountId).subscribe({
      next: (data) => { this.balanceData = data; this.loading = false; this.cdr.detectChanges(); },
      error: () => { this.error = 'Impossibile calcolare il saldo.'; this.loading = false; this.cdr.detectChanges(); },
    });

    this.subs.push(s1, s2);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}