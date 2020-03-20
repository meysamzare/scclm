import { TestBed } from '@angular/core/testing';

import { StdPaymentEditResolverService } from './std-payment-edit-resolver.service';

describe('StdPaymentEditResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StdPaymentEditResolverService = TestBed.get(StdPaymentEditResolverService);
    expect(service).toBeTruthy();
  });
});
