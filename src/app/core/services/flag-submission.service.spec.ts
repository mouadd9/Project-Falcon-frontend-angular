import { TestBed } from '@angular/core/testing';

import { FlagSubmissionService } from './flag-submission.service';

describe('FlagSubmissionService', () => {
  let service: FlagSubmissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlagSubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
