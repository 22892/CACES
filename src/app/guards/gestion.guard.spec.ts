import { TestBed } from '@angular/core/testing';

import { GestionGuard } from './gestion.guard';

describe('GestionGuard', () => {
  let guard: GestionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GestionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
