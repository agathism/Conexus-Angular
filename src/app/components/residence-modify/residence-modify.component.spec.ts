import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceModifyComponent } from './residence-modify.component';

describe('ResidenceModifyComponent', () => {
  let component: ResidenceModifyComponent;
  let fixture: ComponentFixture<ResidenceModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenceModifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenceModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
