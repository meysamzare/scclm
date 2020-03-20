import { TestBed } from '@angular/core/testing';

import { CustomMessageService } from './custom-message.service';

describe('CustomMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomMessageService = TestBed.get(CustomMessageService);
    expect(service).toBeTruthy();
  });
});
