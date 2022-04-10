import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasMonitoringPointsComponent } from './gas-monitoring-points.component';

describe('GasMonitoringPointsComponent', () => {
  let component: GasMonitoringPointsComponent;
  let fixture: ComponentFixture<GasMonitoringPointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasMonitoringPointsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasMonitoringPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
