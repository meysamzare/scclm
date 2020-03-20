import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastInFadakComponent } from './last-in-fadak.component';

describe('LastInFadakComponent', () => {
  let component: LastInFadakComponent;
  let fixture: ComponentFixture<LastInFadakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastInFadakComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastInFadakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
