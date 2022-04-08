import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WastePlaceComponent } from './waste-place.component';

describe('WastePlaceComponent', () => {
  let component: WastePlaceComponent;
  let fixture: ComponentFixture<WastePlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WastePlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WastePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
