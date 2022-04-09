import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculationMethodFormComponent } from './calculation-method-form.component';

describe('CalculationMethodFormComponent', () => {
  let component: CalculationMethodFormComponent;
  let fixture: ComponentFixture<CalculationMethodFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalculationMethodFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculationMethodFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
