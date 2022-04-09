import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollutantsFormComponent } from './pollutants-form.component';

describe('PollutantsFormComponent', () => {
  let component: PollutantsFormComponent;
  let fixture: ComponentFixture<PollutantsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollutantsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollutantsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
