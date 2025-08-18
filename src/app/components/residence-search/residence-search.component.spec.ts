import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceSearchComponent } from './residence-search.component';

describe('ResidenceSearchComponent', () => {
  let component: ResidenceSearchComponent;
  let fixture: ComponentFixture<ResidenceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenceSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
