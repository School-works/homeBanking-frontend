// src/app/services/binance-api.ts
import { Injectable } from '@angular/core';
import { FrankFurterApiService } from './frankfurter-api.service';

@Injectable({ providedIn: 'root' })
export class BinanceApiService {
  private restUrl = 'https://api.binance.com/api/v3';

  constructor(private frankfurter: FrankFurterApiService) {}

  convert(base: string, quote: string, amount: number) {
    return new Promise<string>((resolve, reject) => {
      // Per non-USD, non-BTC/ETH/USDT, convertiamo prima in USD e poi in BTC
      if (base !== 'BTC' && base !== 'ETH' && base !== 'USDT') {
        this.frankfurter
          .convert(base, 'USD', amount)
          .then((usdAmount) => {
            const usdValue = parseFloat(usdAmount);
            return this.getBTCPrice(quote, usdValue);
          })
          .then((result) => resolve(result))
          .catch((error) => {
            console.error('Conversion error:', error);
            reject(error);
          });
      } else {
        // conversione diretta per BTC, ETH o USDT
        this.getBTCPrice(quote, amount)
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      }
    });
  }

  private getBTCPrice(quote: string, amount: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const pair = `${quote}USDT`.toUpperCase();

      fetch(`${this.restUrl}/ticker/price?symbol=${pair}`)
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.json();
        })
        .then((data) => {
          const price = parseFloat(data.price);
          if (isNaN(price)) throw new Error('Invalid price data');
          resolve((amount / price).toFixed(8));
        })
        .catch((error) => {
          console.error('Binance API error:', error);
          reject(error);
        });
    });
  }
}
