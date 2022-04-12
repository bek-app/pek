import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedWasteFormComponent } from './received-waste-form.component';

describe('ReceivedWasteFormComponent', () => {
  let component: ReceivedWasteFormComponent;
  let fixture: ComponentFixture<ReceivedWasteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedWasteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedWasteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
