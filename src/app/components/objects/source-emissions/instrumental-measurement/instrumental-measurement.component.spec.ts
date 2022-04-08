import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentalMeasurementComponent } from './instrumental-measurement.component';

describe('InstrumentalMeasurementComponent', () => {
  let component: InstrumentalMeasurementComponent;
  let fixture: ComponentFixture<InstrumentalMeasurementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentalMeasurementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentalMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
