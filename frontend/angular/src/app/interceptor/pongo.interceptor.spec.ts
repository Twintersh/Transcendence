import { TestBed } from '@angular/core/testing';

import { PongoInterceptor } from './pongo.interceptor';

describe('PongoInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PongoInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: PongoInterceptor = TestBed.inject(PongoInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
