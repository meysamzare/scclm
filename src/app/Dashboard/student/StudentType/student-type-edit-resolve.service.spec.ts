import { TestBed } from '@angular/core/testing';

import { StudentTypeEditResolveService } from './student-type-edit-resolve.service';

describe('StudentTypeEditResolveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentTypeEditResolveService = TestBed.get(StudentTypeEditResolveService);
    expect(service).toBeTruthy();
  });
});
