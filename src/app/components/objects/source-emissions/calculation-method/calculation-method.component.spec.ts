import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationMethodComponent } from './calculation-method.component';

describe('CalculationMethodComponent', () => {
  let component: CalculationMethodComponent;
  let fixture: ComponentFixture<CalculationMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculationMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
