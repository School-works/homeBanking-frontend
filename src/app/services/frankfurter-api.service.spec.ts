import { TestBed } from '@angular/core/testing';

import { FrankfurterApiService } from './frankfurter-api.service';

describe('FrankfurterApiService', () => {
  let service: FrankfurterApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrankfurterApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
