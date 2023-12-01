import { TestBed } from '@angular/core/testing';

import { Oauth42Service } from './oauth42.service';

describe('Oauth42Service', () => {
  let service: Oauth42Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Oauth42Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
