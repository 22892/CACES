import { TestBed } from '@angular/core/testing';

import { LoginLogautService } from './login-logaut.service';

describe('LoginLogautService', () => {
  let service: LoginLogautService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginLogautService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
