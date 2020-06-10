import { TestBed } from '@angular/core/testing';

import { MlEngineService } from './ml-engine.service';

describe('MlEngineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MlEngineService = TestBed.get(MlEngineService);
    expect(service).toBeTruthy();
  });
});
