import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BankingService, Account } from '../../app/services/banking.service';


@Component({
  standalone: true,
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './account-card.html',
  styleUrls: ['./account-card.css'],
})
export class AccountCard implements OnInit, OnDestroy {
  @Input() account!: Account;

  protected apiBalance = signal<number | null>(null);
  protected usdBalance = signal<number | null>(null);
  protected btcBalance = signal<number | null>(null);
  protected isConvertingUSD = signal(false);
  protected isConvertingBTC = signal(false);
  protected showUSD = signal(false);
  protected showBTC = signal(false);

  protected showForm = signal(false);
  protected formType: 'deposit' | 'withdrawal' = 'deposit';
  protected formAmount: number | null = null;
  protected formDescription = '';
  protected formError: string | null = null;
  protected formSubmitting = signal(false);

  private subs: Subscription[] = [];
constructor(private banking: BankingService) {
  console.log('AccountCard constructed for', this.account);
}

  ngOnInit(): void {
    this.refreshBalance();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  protected refreshBalance(): void {
    const sub = this.banking.getBalance(this.account.id).subscribe({
      next: (data) => this.apiBalance.set(data.balance),
      error: () => this.apiBalance.set(0),
    });
    this.subs.push(sub);
  }

  protected get balance(): number {
    return this.apiBalance() ?? 0;
  }

  protected get canConvert(): boolean {
    return this.account?.currency !== 'USD';
  }

  protected openForm(type: 'deposit' | 'withdrawal'): void {
    this.formType = type;
    this.formAmount = null;
    this.formDescription = '';
    this.formError = null;
    this.showForm.set(true);
  }

  protected closeForm(): void {
    this.showForm.set(false);
  }

  protected submitForm(): void {
    if (!this.formAmount || this.formAmount <= 0) {
      this.formError = 'Amount must be a positive number.';
      return;
    }
    if (!this.formDescription.trim()) {
      this.formError = 'Description is required.';
      return;
    }

    this.formError = null;
    this.formSubmitting.set(true);

    const action$ =
      this.formType === 'deposit'
        ? this.banking.deposit(this.account.id, this.formAmount, this.formDescription)
        : this.banking.withdraw(this.account.id, this.formAmount, this.formDescription);

    const sub = action$.subscribe({
      next: () => {
        this.showForm.set(false);
        this.resetUSD();
        this.resetBTC();
        this.refreshBalance();
        this.formSubmitting.set(false);
      },
      error: (err) => {
        this.formError = err?.error?.error ?? err?.message ?? 'Operation failed.';
        this.formSubmitting.set(false);
      },
    });
    this.subs.push(sub);
  }

  protected convertToUSD(): void {
    this.isConvertingUSD.set(true);
    this.usdBalance.set(null);
    this.showUSD.set(false);
    const sub = this.banking.convertFiat(this.account.id, 'USD').subscribe({
      next: (data) => {
        this.usdBalance.set(data.converted_balance);
        this.showUSD.set(true);
        this.isConvertingUSD.set(false);
      },
      error: () => this.isConvertingUSD.set(false),
    });
    this.subs.push(sub);
  }

  protected convertToBTC(): void {
    this.isConvertingBTC.set(true);
    this.btcBalance.set(null);
    this.showBTC.set(false);
    const sub = this.banking.convertCrypto(this.account.id, 'BTC').subscribe({
      next: (data) => {
        this.btcBalance.set(data.converted_balance);
        this.showBTC.set(true);
        this.isConvertingBTC.set(false);
      },
      error: () => this.isConvertingBTC.set(false),
    });
    this.subs.push(sub);
  }

  protected resetUSD(): void {
    this.showUSD.set(false);
    this.usdBalance.set(null);
  }

  protected resetBTC(): void {
    this.showBTC.set(false);
    this.btcBalance.set(null);
  }
}