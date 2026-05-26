import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { BankingService, Account, Conversion } from '../../../app/services/banking.service';

@Component({
  standalone: true,
  selector: 'app-account-convert',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './convert.html',
  styleUrls: ['./convert.css'],
})
export class Convert implements OnInit, OnDestroy {
  protected account?: Account;
  // 'fiat' = valute tradizionali, 'crypto' = criptovalute
  protected mode: 'fiat' | 'crypto' = 'fiat';
  protected targetCurrency = 'USD';
  protected result: Conversion | null = null;
  protected converting = false;
  protected error: string | null = null;

  // Valute disponibili per ogni modalità
  protected fiatOptions = ['USD', 'GBP', 'CHF', 'JPY', 'CAD'];
  protected cryptoOptions = ['BTC', 'ETH'];

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
    const sub = this.banking.getAccount(this.accountId).subscribe({
      next: (account) => { this.account = account; this.cdr.detectChanges(); },
    });
    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // Cambia modalità e resetta il risultato
  protected setMode(mode: 'fiat' | 'crypto'): void {
    this.mode = mode;
    this.result = null;
    this.error = null;
    this.targetCurrency = mode === 'fiat' ? 'USD' : 'BTC';
  }

  // Esegue la conversione tramite API PHP
  protected convert(): void {
    this.converting = true;
    this.result = null;
    this.error = null;

    const call$ = this.mode === 'fiat'
      ? this.banking.convertFiat(this.accountId, this.targetCurrency)
      : this.banking.convertCrypto(this.accountId, this.targetCurrency);

    const sub = call$.subscribe({
      next: (data) => {
        this.result = data;
        this.converting = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.error ?? 'Conversione fallita.';
        this.converting = false;
        this.cdr.detectChanges();
      },
    });
    this.subs.push(sub);
  }

  protected get currencyOptions(): string[] {
    return this.mode === 'fiat' ? this.fiatOptions : this.cryptoOptions;
  }
}