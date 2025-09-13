import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidenceListsComponent } from './residence-lists.component';

describe('ResidenceListsComponent', () => {
  let component: ResidenceListsComponent;
  let fixture: ComponentFixture<ResidenceListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidenceListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidenceListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
