import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurialPlaceFormComponent } from './burial-place-form.component';

describe('BurialPlaceFormComponent', () => {
  let component: BurialPlaceFormComponent;
  let fixture: ComponentFixture<BurialPlaceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurialPlaceFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurialPlaceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
