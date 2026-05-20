// src/app/services/public-api.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FrankFurterApiService {
  private url = 'https://api.frankfurter.dev/';

  getData() {
    return fetch(this.url).then((r) => r.json());
  }

  convert(base: string, quote: string, amount: number) {
    const api = 'https://api.frankfurter.dev';
    return fetch(`${api}/v2/rate/${base}/${quote}`)
      .then((r) => r.json())
      .then((d) => (amount * d.rate).toFixed(2));
  }
}
