import { TestBed } from '@angular/core/testing';

import { ConveniencesService } from '././conveniences.service';

describe('ConveniencesService', () => {
  let service: ConveniencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConveniencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
