import { TestBed } from '@angular/core/testing';

import { BinanceApiService } from './binance-api';

describe('BinanceApiService', () => {
  let service: BinanceApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
