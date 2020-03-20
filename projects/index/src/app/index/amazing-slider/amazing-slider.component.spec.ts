import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazingSliderComponent } from './amazing-slider.component';

describe('AmazingSliderComponent', () => {
  let component: AmazingSliderComponent;
  let fixture: ComponentFixture<AmazingSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmazingSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmazingSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
