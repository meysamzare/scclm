import { TestBed } from '@angular/core/testing';

import { PrintDataService } from './print-data.service';

describe('PrintDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrintDataService = TestBed.get(PrintDataService);
    expect(service).toBeTruthy();
  });
});
