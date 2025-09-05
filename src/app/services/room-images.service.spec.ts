import { TestBed } from '@angular/core/testing';

import { RoomImagesService } from './room-images.service';

describe('RoomImagesService', () => {
  let service: RoomImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
