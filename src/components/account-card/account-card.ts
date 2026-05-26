import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Account } from '../../models/account';
import { FrankFurterApiService } from '../../app/services/frankfurter-api.service';
import { BinanceApiService } from '../../app/services/binance-api';

@Component({
  standalone: true,
  selector: 'app-account-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-card.html',
  styleUrls: ['./account-card.css'],
})
export class AccountCard {
  @Input() account!: Account;

  protected usdBalance = signal<number | null>(null);
  protected btcBalance = signal<number | null>(null);
  protected isConvertingUSD = signal(false);
  protected isConvertingBTC = signal(false);
  protected showUSD = signal(false);
  protected showBTC = signal(false);

  constructor(private frankFurterApi: FrankFurterApiService, private binanceApi: BinanceApiService) {}

  protected get balance(): number {
    return this.account?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) ?? 0;
  }

  protected get canConvert(): boolean {
    return this.account?.currency !== 'USD';
  }

  protected convertToUSD(): void {
    if (!this.account) return;

    this.isConvertingUSD.set(true);
    this.usdBalance.set(null);
    this.showUSD.set(false);

    this.frankFurterApi
      .convert(this.account.currency, 'USD', this.balance)
      .then((result) => {
        this.usdBalance.set(parseFloat(result));
        this.showUSD.set(true);
      })
      .catch(() => {
        this.usdBalance.set(null);
      })
      .finally(() => {
        this.isConvertingUSD.set(false);
      });
  }

  protected convertToBTC(): void {
    if (!this.account) return;

    this.isConvertingBTC.set(true);
    this.btcBalance.set(null);
    this.showBTC.set(false);

    this.binanceApi
      .convert(this.account.currency, 'BTC', this.balance)
      .then((result) => {
        this.btcBalance.set(parseFloat(result));
        this.showBTC.set(true);
      })
      .catch(() => {
        this.btcBalance.set(null);
      })
      .finally(() => {
        this.isConvertingBTC.set(false);
      });
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
