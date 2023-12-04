import { TestBed } from '@angular/core/testing';

import { LocalDataManagerService } from './local-data-manager.service';

describe('LocalDataManagerService', () => {
  let service: LocalDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDataManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
