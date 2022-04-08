import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GasMonitoringComponent } from './gas-monitoring.component';

describe('GasMonitoringComponent', () => {
  let component: GasMonitoringComponent;
  let fixture: ComponentFixture<GasMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GasMonitoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GasMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
