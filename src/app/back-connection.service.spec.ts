import { TestBed } from '@angular/core/testing';

import { BackConnectionService } from './back-connection.service';

describe('BackConnectionService', () => {
  let service: BackConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
