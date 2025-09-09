import { TestBed } from '@angular/core/testing';

import { ResidenceImagesService } from '././residence-images.service';

describe('ResidenceImagesService', () => {
  let service: ResidenceImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResidenceImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
