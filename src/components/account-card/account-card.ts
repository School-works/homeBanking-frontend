import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Account } from '../../models/account';
import { FrankFurterApiService } from '../../app/services/frankfurter-api.service';

@Component({
  standalone: true,
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-card.html',
  styleUrls: ['./account-card.css'],
})
export class AccountCard {
  @Input() account!: Account;

  protected convertedBalance = signal<string | null>(null);
  protected isConverting = signal(false);

  constructor(private frankFurterApi: FrankFurterApiService) {}

  protected get balance(): number {
    return this.account?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) ?? 0;
  }

  protected get canConvert(): boolean {
    return this.account?.currency !== 'USD';
  }

  protected convertBalance(): void {
    if (!this.account) {
      return;
    }

    this.isConverting.set(true);
    this.convertedBalance.set(null);

    this.frankFurterApi
      .convert(this.account.currency, 'USD', this.balance)
      .then((result) => {
        this.convertedBalance.set(`${this.balance.toFixed(2)} ${this.account.currency} = ${result} USD`);
      })
      .catch(() => {
        this.convertedBalance.set('Conversion failed. Please try again.');
      })
      .finally(() => {
        this.isConverting.set(false);
      });
  }
}
