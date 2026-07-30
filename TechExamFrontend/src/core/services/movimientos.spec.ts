import { TestBed } from '@angular/core/testing';

import { MovimientosService } from './movimientosService';

describe('MovimientosService', () => {
  let service: MovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
