import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasMonitoringFormComponent } from './gas-monitoring-form.component';

describe('GasMonitoringFormComponent', () => {
  let component: GasMonitoringFormComponent;
  let fixture: ComponentFixture<GasMonitoringFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasMonitoringFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasMonitoringFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
