import { TestBed } from '@angular/core/testing';

import { IndisponibilitiesService } from '././indisponibilities.service';

describe('IndisponibilitiesService', () => {
  let service: IndisponibilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndisponibilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
