import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestInWeekComponent } from './best-in-week.component';

describe('BestInWeekComponent', () => {
  let component: BestInWeekComponent;
  let fixture: ComponentFixture<BestInWeekComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestInWeekComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestInWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
