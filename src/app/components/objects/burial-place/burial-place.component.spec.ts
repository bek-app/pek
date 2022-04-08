import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurialPlaceComponent } from './burial-place.component';

describe('BurialPlaceComponent', () => {
  let component: BurialPlaceComponent;
  let fixture: ComponentFixture<BurialPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurialPlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurialPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
