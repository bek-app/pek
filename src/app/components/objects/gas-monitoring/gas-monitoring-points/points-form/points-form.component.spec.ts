import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsFormComponent } from './points-form.component';

describe('PointsFormComponent', () => {
  let component: PointsFormComponent;
  let fixture: ComponentFixture<PointsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
